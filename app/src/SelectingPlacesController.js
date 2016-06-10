(function() {

  'use strict';

  angular
    .module('App')
    .controller('SelectingPlacesController', [
      '$scope',
      'appModel',
      // 'markersService',
      // 'placesService',
      SelectingPlacesController
    ]);


    /**
     * SelectingPlaces Controller for Hi-Tec Walking Route
     * @constructor
     */
    function SelectingPlacesController($scope, appModel) {
      // markersService.getPlaces();

      this.next = function() {
        $scope.$emit(appModel.events.nextState);
      }
    }

})();
