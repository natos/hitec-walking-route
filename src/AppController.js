angular
  .module('App')
  .controller('AppController', [
    '$scope', '$rootScope', '$timeout',
    'appModel', 'placesModel', 'mapModel',
    'placesService', 'mapService',
    AppController
  ]);

/**
 * Map Controller for Hi-Tec Walking Route
 * @param $scope
 * @param $rootScope
 * @param appModel
 * @constructor
 */
function AppController($scope, $rootScope, $timeout, appModel, placesModel, mapModel, placesService, mapService) {

  if (!google || !google.maps) {
    console.error('Google Maps API is unavailable.');
  }

  var self = this;
      // expose state helper
      self.state = appModel.state;
      self.rawplaces = placesService.getPlaces();
      // expose navigation helpers
      self.next = next;
      self.prev = prev;

  /**
   * Move to the next state
   * @public
   */
  function next() {
    appModel.next();
  }

  /**
   * Move to the previous state
   * @public
   */
  function prev() {
    appModel.prev();
  }

  /**
   * Places data is home
   * @private
   */
  function placesAreReady() {
    //  expose all places
    self.places = placesService.getPlaces();
    self.placesByCategory = placesService.getPlacesByCategory();

    // move to the next state
    next();
  }

  function restart() {
    $rootScope.selected = placesModel.selected = {
      places: [],
      start: 0,
      end: 0
    };
    appModel.setState(3);
  }

  /* model bindings */

  // Bind selected model to the view-model
  // This way we avoid the overload of having
  // watchers for each property
  $rootScope.selected = placesModel.selected;

  /* delegate */

  $rootScope.$on(appModel.events.nextState, next);

  $rootScope.$on(appModel.events.prevState, prev);

  $rootScope.$on(mapModel.events.restart, restart);

  $rootScope.$on(placesModel.events.placesReady, placesAreReady);

}
