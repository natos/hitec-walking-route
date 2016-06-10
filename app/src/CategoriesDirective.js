(function() {

  'use strict';

  angular
    .module('map')
    .directive('categories', function() {
      return {
        restrict: 'E',
        templateUrl: './src/Categories.html',
        link: function($scope) {
          $scope.changed = function() {
            $scope.$emit('categoriesDirective:changed');
          };
        }
      };
    });

})();
