(function() {

  'use strict';

  angular
    .module('map')
    .controller('MapController', [
      '$scope', '$rootScope', '$window', 'mapService', 'markersService', 'directionsService', 'categoriesService',
      '$mdBottomSheet', '$mdDialog', '$mdSidenav', '$timeout', '$log',
      MapController
    ]);

  /**
   * Map Controller for Hi-Tec Walking Route
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function MapController($scope, $rootScope, $window, mapService, markersService, directionsService, categoriesService, $mdBottomSheet, $mdDialog, $mdSidenav, $timeout, $log ) {

    if (!google || !google.maps) {
      console.error('Google Maps API is unavailable.');
    }

    var self = this;

    self.map = mapService.getMap();
    self.selected = null;
    self.printMode = false;
    self.active = false;
    self.openDirections = false;
    self.categories = [].concat(categoriesService.getCategories());
    self.selectedCategories = [].concat(self.categories);
    self.rawMarks = [].concat(markersService.getMarks());
    self.selectedMarkers = [];
    self.center = centerMap;
    self.restart = restartMap;
    self.optimize = optimizeMap;
    self.showPlace = showPlace;
    self.showDirections = showDirections;
    self.hideDirections = hideDirections;
    self.setPrintMode = setPrintMode;
    self.unsetPrintMode = unsetPrintMode;
    self.print = printMap;

    // drop markers
    markersService.dropMarkers();

    function print() {
      $window.print();
    }

    function setPrintMode() {
      // self.staticMapURL = directionsService.getStaticMapWithDirections();
      self.directions = directionsService.getCurrentDirections();
      $timeout(function() {
        self.printMode = true;
      });
    }

    function unsetPrintMode() {
      self.directions = null;
      self.printMode = false;
    }

    function centerMap() {
      $rootScope.$broadcast('mapController:center-map');
    }

    function restartMap() {
      $rootScope.$broadcast('mapController:restart-map');
    }

    function optimizeMap() {
      $rootScope.$broadcast('mapController:optimize-route');
    }

    function printMap() {
      $rootScope.$broadcast('mapController:print');
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
       * User ContactSheet controller
       */
      function MarkerDetailController($scope, $mdDialog) {
        $scope.marker = marker;
        $scope.closeDialog = closeDialog;
      }
    }

    // delegate
    $rootScope.$on('markersService:cleaned-markers', updateMarkers);
    $rootScope.$on('markersService:toggled-mark', updateMarkers);
    $rootScope.$on('directionsService:calculating-route', activate);
    $rootScope.$on('directionsService:calculating-route-end', deactivate);

  }

})();
