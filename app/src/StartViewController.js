(function() {

  'use strict';

  angular
    .module('map')
    .controller('StartViewController', [
      'markersService',
      StartViewController
    ]);

    function StartViewController(markersService) {
      markersService.getPlaces();
    }

})();
