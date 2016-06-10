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

    mapService.getReady();

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
     * Updates App State
     * @private
     */
    function currentStateChanged() {
      console.log('currentStateChanged', appModel.getState());
      // apply state change
      if (!$rootScope.$$phase) $rootScope.$apply();
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
      // TODO: remove this hack to make app auto start
      $timeout(function() {
        next();
      }, 1000)
    }


    /* delegate */

    $rootScope.$on(appModel.events.nextState, next);

    $rootScope.$on(appModel.events.prevState, prev);

    $rootScope.$on(appModel.events.stateChanged, currentStateChanged);

    $rootScope.$on(placesModel.events.placesReady, placesAreReady);


  }

})();
