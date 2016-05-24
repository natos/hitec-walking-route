(function(){

  'use strict';

  angular
    .module('map')
    .controller('MapController', [
      '$scope', '$rootScope', 'mapService', 'markersService', 'directionsService', '$mdDialog', '$mdSidenav', '$timeout', '$log',
      MapController
    ]);

  /**
   * Map Controller for Hi-Tec Walking Route
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function MapController($scope, $rootScope, mapService, markersService, directionsService, $mdDialog, $mdSidenav, $timeout, $log ) {

    if (!google || !google.maps) {
      console.error('Google Maps API is unavailable.');
    }

    var self = this;

    self.map = mapService.getMap();
    self.optimizeWaypoints = false;
    self.selected = null;
    self.rawMarks = [].concat(markersService.getMarks());
    self.selectedMarkers = [];
    self.center = centerMap;
    self.restart = restartMap;
    self.showPlace = showPlace;
    self.toggleList = toggleList;

    markersService.dropMarkers();

    function centerMap() {
      mapService.centeMap();
      // self.map.setCenter(mapService.getCenterPoints());
    }

    function restartMap() {
      self.selectedMarkers.splice(0, self.selectedMarkers.length);
    }

    $scope.$watch('optimizeWaypoints', function(newVal, oldVal) {
      if (newVal !== oldVal) {
        directionsService.setOptimizeWaypoints(newVal);
      }
    });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Close marker dialog and unselect it from the list
     */
    function closeDialog() {
      // unselect
      self.selected = null;
      // hide dialog
      $mdDialog.hide();
    }

    /**
     * Show more information about a Marker
     * @param marker
     */
    function showPlace(marker) {

      var isAlreadySelected = self.selected === marker;
      var isDialogOpen = document.getElementsByTagName('md-dialog')[0];

      // When selected dialog is triggered, close dialog and return
      if (isAlreadySelected && isDialogOpen) {
        return closeDialog();
      }
      // otherwise, close dialog and keep moving on to select next location
      if (isDialogOpen) {
          closeDialog();
      }

      // select marker
      self.selected = marker;
      // show dialog
      $mdDialog.show({
        controller: ['$scope', '$mdDialog', MarkerDetailController],
        clickOutsideToClose: true,
        // parent: angular.element(document.body),
        parent: angular.element(document.getElementById('content')),
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
        $scope.closeDialog = function() {
          $mdDialog.hide();
          // unselect
          self.selected = null;
        };
      }
    }

    /**
     * Hide or Show the 'right' sideNav area
     */
    function toggleList() {
      $mdSidenav('right').toggle();
    }

    function updateMarkers() {
      self.selectedMarkers = markersService.getSelectedMarkers();
    }

    $rootScope.$on('markersService:toggled-mark', updateMarkers);
  }

})();
