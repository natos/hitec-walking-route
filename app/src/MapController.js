(function() {

  'use strict';

  angular
    .module('App')
    .controller('MapController', [
      '$scope', '$rootScope', '$window',
      'appModel',
      'mapService', 'markersService', 'directionsService', 'placesService',
      '$mdDialog', '$timeout', '$interval',
      MapController
    ]);

  /**
   * Map Controller for Hi-Tec Walking Route
   * @param $scope
   * @param avatarsService
   * @constructor
   */
  function MapController($scope, $rootScope, $window, appModel, mapService, markersService, directionsService, placesService, $mdDialog, $timeout, $interval) {

    if (!google || !google.maps) {
      console.error('Google Maps API is unavailable.');
    }

    var self = this;

        self.active = true;
        self.loaded = false;
        self.ready = false;
        self.isReady = function () {
          return self.loaded && self.ready;
        };
        self.map = mapService.getMap();
        self.selectedMarkers = [];
        self.center = centerMap;
        self.restart = restartMap;
        // self.showPlace = showPlace;
        // self.showRoute = showRoute;
        // self.setPrintMode = setPrintMode;
        // self.unsetPrintMode = unsetPrintMode;
        // self.print = print;

    function currentStateChanged() {
      // get markers in the map
      // get directions
      if (appModel.state.isLoadingDirections()) {
        markersService.createMarkers();
        markersService.dropYourLocationPin();
        directionsService.calculateAndDisplayRoute();
        transitionToRoute();
      }
      // map is READY
      if (appModel.state.isReviewing()) {
        mapService.getReady();
        centerMap();
        $timeout(closeDialog, 700);
        $timeout(setReady, 1500);
      }
      // apply state change
      if (!$rootScope.$$phase) $rootScope.$apply();
    }

    function print() {
      $rootScope.$broadcast('mapController:print');
      $window.print();
    }

    function setPrintMode() {
      $rootScope.$broadcast('mapController:set-print-mode');
      // self.staticMapURL = directionsService.getStaticMapWithDirections();
      self.directions = directionsService.calculateDirections().get();
      $timeout(function() {
        self.printMode = true;
      });
    }

    function unsetPrintMode() {
      self.directions = null;
      self.printMode = false;
      $rootScope.$broadcast('mapController:unset-print-mode');
    }

    function centerMap() {
      $rootScope.$broadcast('mapController:center-map');
    }

    function restartMap() {
      $rootScope.$broadcast('mapController:restart-map');
    }

    // function updateMarkers() {
    //   self.selectedMarkers = markersService.getSelectedMarkers();
    // }

    function setReady() {
      self.ready = true;
    }

    function setLoaded() {
      self.loaded = true;
    }

    function setActive() {
      self.active = true;
    }

    function setUnactive() {
      self.active = false;
    }


    function closeDialog() {
      $mdDialog.hide();
    }

    function transitionToRoute(event) {

      $mdDialog
        .show({
          controller: ['$scope', '$mdDialog', LoadingRouteController],
          parent: '#map-container',
          templateUrl: './src/LoadingRoute.html'
        })
        .finally(function() {
          console.log('finally', _CLOSE_TIMEOUT)
          // $timeout.cancel(_CLOSE_TIMEOUT);
        });;

      /**
       * Show Route controller
       */
      function LoadingRouteController($scope, $mdDialog) {
        $scope.closeDialog = closeDialog;
        $scope.ready = false;
        $scope.value = 0;
        $scope.bufferValue = 10;
        var i = $interval(function() {
          $scope.value += 3;
          $scope.bufferValue += 3.333;
          if ($scope.value >= 100 && $scope.ready) {
            $interval.cancel(i);
            $timeout(function() {
              $rootScope.$emit(appModel.events.nextState);
            }, 500);
          }
        }, 100, 0, true);

        $rootScope.$on('directionsService:calculating-route-end', function() {
          console.log('done? yeah close this down');
          $scope.ready = true;
        });

      }
    }

    /**
     * Show more information about a Marker
     * @param marker
     */
    function showPlace(marker) {

      var isAlreadySelected = self.selected === marker;
      var isDialogOpen = angular.element(document.body).hasClass('md-dialog-is-showing');

      // When selected dialog is triggered, close dialog and return
      if (isAlreadySelected && isDialogOpen) {
        self.selected = null;
        return closeDialog();
      }
      // otherwise, close dialog and keep moving on to select next location
      if (isDialogOpen) {
        closeDialog();
      }

      // select marker
      self.selected = marker;
      // show dialog
      $mdDialog
        .show({
          controller: ['$scope', '$mdDialog', MarkerDetailController],
          clickOutsideToClose: true,
          parent: '#content',
          templateUrl: './src/MarkerDetail.html',
          // fancy animations
          openFrom: '.marker-' + marker.mark.id,
          closeTo: '.marker-' + marker.mark.id
        });
      /**
       * Marker Detail controller
       */
      function MarkerDetailController($scope, $mdDialog) {
        $scope.marker = marker;
        $scope.closeDialog = closeDialog;
      }
    }

    /* delegate */

    $rootScope.$on(appModel.events.stateChanged, currentStateChanged);

    // $rootScope.$on('markersService:cleaned-markers', updateMarkers);
    // $rootScope.$on('markersService:toggled-mark', updateMarkers);

    $rootScope.$on('directionsService:calculating-route', setActive);
    $rootScope.$on('directionsService:calculating-route-end', setUnactive);
    $rootScope.$on('directionsService:calculating-route-end', setLoaded);


  }

})();
