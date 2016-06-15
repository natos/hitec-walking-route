(function() {

  'use strict';

  angular
    .module('App')
    .controller('MapController', [
      '$scope', '$rootScope', '$window',
      'mapService', 'markersService', 'directionsService', 'categoriesService',
      '$mdBottomSheet', '$mdDialog', '$mdSidenav', '$timeout', '$interval', '$log',
      MapController
    ]);

  /**
   * Map Controller for Hi-Tec Walking Route
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function MapController($scope, $rootScope, $window, mapService, markersService, directionsService, categoriesService, $mdBottomSheet, $mdDialog, $mdSidenav, $timeout, $interval, $log ) {

    if (!google || !google.maps) {
      console.error('Google Maps API is unavailable.');
    }

    var self = this;
console.log('map controller')
    self.map = mapService.getMap();
    self.selected = null;
    self.loaded = true;
    self.started = true;
    self.printMode = false;
    self.active = false;
    self.openDirections = false;
    self.categories = [].concat(categoriesService.getCategories());
    self.selectedCategories = [].concat(self.categories);
    self.rawMarks = [].concat(markersService.getMarks());
    self.selectedMarkers = [];
    self.start = start;
    self.isReady = isReady;
    self.isLoaded = isLoaded;
    self.isPristine = isPristine;
    self.center = centerMap;
    self.restart = restartMap;
    self.showPlace = showPlace;
    self.showRoute = showRoute;
    self.showDirections = showDirections;
    self.hideDirections = hideDirections;
    self.setPrintMode = setPrintMode;
    self.unsetPrintMode = unsetPrintMode;
    self.print = print;

    function isPristine() {
      return !self.started;
    }

    function isReady() {
      return self.started && !self.printMode;
    }

    function isLoaded() {
      return self.loaded;
    }

    var isLocationReady = false;
    function locationReady() { isLocationReady = true; load(); }

    var arePlacesReady = false;
    function placesReady() { arePlacesReady = true; load(); }

    function load() {
      if (isLocationReady && arePlacesReady) {
        self.loaded = true;
        mapService.getReady();
        if (!$rootScope.$$phase) $rootScope.$apply();
      }
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

    function start() {
      self.started = true;
      markersService.dropYourLocationPin();
      $timeout(function() {
        markersService.dropMarkers();
      }, 1000);
      mapService.getReady();
    }

    function centerMap() {
      $rootScope.$broadcast('mapController:center-map');
    }

    function restartMap() {
      self.selectedCategories = [].concat(self.categories);
      $rootScope.$broadcast('mapController:restart-map');
    }

    function showDirections() {
      self.directions = directionsService.getCurrentDirections();
      $timeout(function() {
        self.openDirections = true;
      });
    }

    function hideDirections() {
      self.openDirections = false;
    }

    function updateMarkers() {
      self.selectedMarkers = markersService.getSelectedMarkers();
    }

    function updatedSelectedCategories() {
      self.selectedCategories = CategoriesService.getSelectedCategories();
    }

    function activate() {
      self.active = true;
    }

    function deactivate() {
      $timeout(function() {
        self.active = false;
      }, 600);
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

    // delegate
    $rootScope.$on('mapService:location-ready', locationReady);
    $rootScope.$on('markersService:places-ready', placesReady);

    $rootScope.$on('markersService:cleaned-markers', updateMarkers);
    $rootScope.$on('markersService:toggled-mark', updateMarkers);

    $rootScope.$on('directionsService:calculating-route', activate);
    $rootScope.$on('directionsService:calculating-route-end', deactivate);

    $rootScope.$on('categoriesDirective:changed', activate);
    $rootScope.$on('markersService:filtered-by-categories', deactivate);

  }

})();
