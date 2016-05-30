(function() {

  'use strict';

  angular
    .module('map')
    .directive('staticMap', function() {
      return {
        restrict: 'E',
        templateUrl: './src/StaticMap.html'
      };
    });


})();
