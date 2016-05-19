(function(){

  'use strict';

  angular
    .module('map')
    .controller('MapController', [
      '$scope', 'mapService', 'markersService', '$mdDialog', '$mdSidenav', '$timeout', '$log',
      MapController
    ]);

  /**
   * Map Controller for Hi-Tec Walking Route
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function MapController($scope, mapService, markersService, $mdDialog, $mdSidenav, $timeout, $log ) {

    if (!google || !google.maps) {
      console.error('Google Maps API is unavailable.');
    }

    var self = this;

    self.map = mapService.getMap();
    self.selected = null;
    self.rawMarks = [].concat(markersService.getMarkers());
    self.selectedMarkers = [];
    self.center = centerMap;
    self.restart = restartMap;
    self.showPlace = showPlace;
    self.toggleList = toggleList;


    for (var i = 0; i < self.rawMarks.length; i += 1) {
      dropMark(self.rawMarks[i], i);
    }

    function dropMark(mark, i) {
      $timeout(function() {
        var marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: mark.position,
          mark: mark,
          map: self.map
        });
        marker.addListener('click', toggleMark);
      }, (i+.75) * 350); // drop timing
    }

    function toggleMark() {
      // map.setCenter(this.getPosition());
      var labelId = 'label_' + this.mark.id;
      var position = self.selectedMarkers.indexOf(this);
      var isAlreadySelected = position >= 0;
      if (isAlreadySelected) {
        self.selectedMarkers.splice(position, 1);
      } else {
        var order = self.selectedMarkers.push(this);
        this.mark.order = order;
      }
      reorder();
      // calculateAndDisplayRoute();
      if (!$scope.$$phase) $scope.$apply();
    }

    function reorder() {
      for (var i = 0; i < self.selectedMarkers.length; i += 1) {
        console.log('order', self.selectedMarkers[i].mark.order, i+1);
        self.selectedMarkers[i].mark.order = i+1;
      }
    }

    function centerMap() {
      self.map.setCenter(mapService.getCenterPoints());
    }

    function restartMap() {
      self.selectedMarkers.splice(0, self.selectedMarkers.length);
    }

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Unselect a Marker in the list
     * @param marker
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
      // .finally(function() {
      //
      // });

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
  }

})();
