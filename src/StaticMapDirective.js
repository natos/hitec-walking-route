angular
  .module('App')
  .directive('staticMap', function() {
    return {
      restrict: 'E',
      templateUrl: 'src/StaticMap.html',
      controller: 'StaticMapController as static'
    };
  });
