(function() {

  'use strict';

  angular
    .module('App')
    .directive('selectingStart', SelectingStartDirective);

    /**
     * StartView Directive for Hi-Tec Walking Route
     * @constructor
     */
    function SelectingStartDirective() {
      return {
        restrict: 'E',
        templateUrl: './src/SelectingStartEndDirective.html'
      };
    }

})();
