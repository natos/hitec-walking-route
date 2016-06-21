(function() {

  'use strict';

  angular
    .module('App')
    .controller('AppController', [
      '$scope', '$rootScope', '$timeout',
      'appModel', 'placesModel',
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
  function AppController($scope, $rootScope, $timeout, appModel, placesModel, placesService, mapService) {

    if (!google || !google.maps) {
      console.error('Google Maps API is unavailable.');
    }

    var self = this;
        // expose state helper
        self.state = appModel.state;
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

      console.log('Places ready man')

      // move to the next state
      next();
      // TODO: remove this hack to make app auto start
      $timeout(function() {
        next();
      }, 1000)
    }

    /* model bindings */

    // Bind selected model to the view-model
    // This way we avoid the overload of having
    // watchers for each property
    $scope.selected = placesModel.selected;

    /* delegate */

    $rootScope.$on(appModel.events.nextState, next);

    $rootScope.$on(appModel.events.prevState, prev);

    $rootScope.$on(placesModel.events.placesReady, placesAreReady);

  }

})();
