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
        self.map = mapService.getMap();
        self.selectedMarkers = [];
        self.center = centerMap;
        self.restart = restartMap;
        // self.showPlace = showPlace;
        // self.showRoute = showRoute;
        // self.setPrintMode = setPrintMode;
        // self.unsetPrintMode = unsetPrintMode;
        // self.print = print;


    function shakeThatMap() {
      mapService.getReady();
      markersService.dropYourLocationPin();
      $timeout(function () {
        markersService.dropMarkers();
      }, 1500);
    }

    function currentStateChanged() {
      // get map READY
      if (appModel.state.isReviewing()) {
        shakeThatMap();
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

    function updateMarkers() {
      self.selectedMarkers = markersService.getSelectedMarkers();
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

    function showRoute(event) {

      var _INTERVAL;
      var _CLOSE_TIMEOUT;
      var _TIMEOUT_VALUE = 3000;

      // auto close dialog
      _CLOSE_TIMEOUT = $timeout(function () {
        if (_INTERVAL) _INTERVAL.cancel();
        setPrintMode()
        closeDialog();
      }, _TIMEOUT_VALUE);

      $mdDialog
        .show({
          controller: ['$scope', '$mdDialog', LoadingRouteController],
          clickOutsideToClose: true,
          parent: '#map',
          templateUrl: './src/LoadingRoute.html',
          // fancy animations
          openFrom: '.finish',
          closeTo: '.finish'
        })
        .finally(function() {
          console.log('finally', _CLOSE_TIMEOUT)
          $timeout.cancel(_CLOSE_TIMEOUT);
        });;

      /**
       * Show Route controller
       */
      function LoadingRouteController($scope, $mdDialog) {
        $scope.closeDialog = closeDialog;
        $scope.value = 0;
        $scope.bufferValue = 10;
        $interval(function() {
          $scope.value += 2;
          $scope.bufferValue += 2.22;
        }, 75, 0, true);
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

    $rootScope.$on('markersService:cleaned-markers', updateMarkers);
    $rootScope.$on('markersService:toggled-mark', updateMarkers);

    $rootScope.$on('directionsService:calculating-route', setActive);
    $rootScope.$on('directionsService:calculating-route-end', setUnactive);


  }

})();
