(function() {

  'use strict';

  angular
    .module('map')
    .directive('directions', function() {
      return {
        restrict: 'E',
        templateUrl: './src/Directions.html'
      };
    });


})();
