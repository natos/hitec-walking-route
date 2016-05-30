(function() {

  'use strict';

  angular
    .module('map')
    .controller('DirectionsController', [
      '$rootScope', '$scope', '$mdBottomSheet', 'directionsService',
      DirectionsController
    ]);

  /**
   * Directions Controller for Hi-Tec Walking Route
   * @param $scope
   * @param $mdBottomSheet
   * @param directionsService
   * @constructor
   */
  function DirectionsController($rootScope, $scope, $mdBottomSheet, directionsService) {

    $scope.directions = directionsService.getCurrentDirections();

    $scope.isOpen = false;

    $rootScope.$on('mapController:show-directions', open);

    function open() {
      $scope.isOpen = true;
    }

    $scope.close = function() {
      $mdBottomSheet.hide();
    };
  }

})();
