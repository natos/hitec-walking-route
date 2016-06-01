(function() {

  'use strict';

  angular
    .module('map')
    .directive('startView', function() {
      return {
        restrict: 'E',
        templateUrl: './src/StartView.html'
      };
    });


})();
