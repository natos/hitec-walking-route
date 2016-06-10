(function() {

  'use strict';

  angular
    .module('App')
    .controller('StartViewController', [
      // 'markersService',
      'placesService',
      StartViewController
    ]);


    /**
     * StartView Controller for Hi-Tec Walking Route
     * @constructor
     */
    function StartViewController(/*markersService*/placesService) {
      // markersService.getPlaces();
    }

})();
