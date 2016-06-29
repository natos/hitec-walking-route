angular
  .module('App')
  .directive('selectingPlaces', SelectingPlacesDirective);

  /**
   * StartView Directive for Hi-Tec Walking Route
   * @constructor
   */
  function SelectingPlacesDirective() {
    return {
      restrict: 'E',
      templateUrl: './src/SelectingPlacesDirective.html'
    };
  }
