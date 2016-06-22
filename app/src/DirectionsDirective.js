(function() {

  'use strict';

  angular
    .module('App')
    .directive('directions', function() {
      return {
        restrict: 'E',
        templateUrl: './src/Directions.html',
        controller: 'DirectionsController as directions'
      };
    });


})();
