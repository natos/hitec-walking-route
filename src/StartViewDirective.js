angular
  .module('App')
  .directive('startView', StartViewDirective);

  /**
   * StartView Directive for Hi-Tec Walking Route
   * @constructor
   */
  function StartViewDirective() {
    return {
      restrict: 'E',
      templateUrl: 'src/StartViewDirective.html',
      controller:  'StartViewController'
    };
  }
