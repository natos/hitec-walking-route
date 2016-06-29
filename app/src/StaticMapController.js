angular
  .module('App')
  .controller('StaticMapController', [
    '$scope', '$rootScope', '$window',
    'appModel',
    StaticMapController
  ]);

/**
 * Static Map Controller for Hi-Tec Walking Route
 * @param $scope
 * @param avatarsService
 * @constructor
 */
function StaticMapController($scope, $rootScope, $window, appModel) {

  if (!google || !google.maps) {
    console.error('Google Maps API is unavailable.');
  }

  var self = this;

      self.cancel = function() {
        $rootScope.$emit(appModel.events.prevState);
      };

      self.print = function() {
        $window.print();
      };

  /* delegate */

  // $rootScope.$on(appModel.events.stateChanged, currentStateChanged);

}
