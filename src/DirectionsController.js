angular
  .module('App')
  .controller('DirectionsController', [
    '$scope', '$rootScope',
    'directionsService',
    DirectionsController
  ]);

/**
 * Directions Controller for Hi-Tec Walking Route
 * @param $scope
 * @param avatarsService
 * @constructor
 */
function DirectionsController($scope, $rootScope, directionsService) {

  if (!google || !google.maps) {
    console.error('Google Maps API is unavailable.');
  }

  var self = this;

      self.route = directionsService.getCurrentRoute();
      self.distance = directionsService.getTotalDistance();
      self.duration = directionsService.getTotalDuration();

}
