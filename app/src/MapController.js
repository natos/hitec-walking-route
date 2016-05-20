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
    self.selected = null;
    self.rawMarks = [].concat(markersService.getMarks());
    self.selectedMarkers = [];
    self.center = centerMap;
    self.restart = restartMap;
    self.showPlace = showPlace;
    self.toggleList = toggleList;

    markersService.dropMarkers();

    // for (var i = 0; i < self.rawMarks.length; i += 1) {
    //   dropMark(self.rawMarks[i], i);
    // }
    //
    // function dropMark(mark, i) {
    //   $timeout(function() {
    //     var marker = new google.maps.Marker({
    //       animation: google.maps.Animation.DROP,
    //       position: mark.position,
    //       mark: mark,
    //       map: self.map,
    //       icon: {
    //         path: "M27.648 -41.399q0 -3.816 -2.7 -6.516t-6.516 -2.7 -6.516 2.7 -2.7 6.516 2.7 6.516 6.516 2.7 6.516 -2.7 2.7 -6.516zm9.216 0q0 3.924 -1.188 6.444l-13.104 27.864q-0.576 1.188 -1.71 1.872t-2.43 0.684 -2.43 -0.684 -1.674 -1.872l-13.14 -27.864q-1.188 -2.52 -1.188 -6.444 0 -7.632 5.4 -13.032t13.032 -5.4 13.032 5.4 5.4 13.032z",
    //         scale: 0.6,
    //         strokeWeight: 0,
    //         // strokeWeight: 0.2,
    //         // strokeColor: 'black',
    //         // strokeOpacity: 1,
    //         fillColor: mark.color,
    //         fillOpacity: 0.85,
    //       }
    //     });
    //     marker.addListener('click', toggleMark);
    //   }, (i+.75) * 350); // drop timing
    // }

    // function toggleMark() {
    //   // map.setCenter(this.getPosition());
    //   var labelId = 'label_' + this.mark.id;
    //   var position = self.selectedMarkers.indexOf(this);
    //   var isAlreadySelected = position >= 0;
    //   if (isAlreadySelected) {
    //     self.selectedMarkers.splice(position, 1);
    //   } else {
    //     var order = self.selectedMarkers.push(this);
    //     this.mark.order = order;
    //   }
    //   reorderMarkers();
    //   // calculateAndDisplayRoute();
    //   if (!$scope.$$phase) $scope.$apply();
    // }
    //
    // function reorderMarkers() {
    //   for (var i = 0; i < self.selectedMarkers.length; i += 1) {
    //     self.selectedMarkers[i].mark.order = i+1;
    //   }
    // }

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
