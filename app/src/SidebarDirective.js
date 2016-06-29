angular
  .module('App')
  .directive('sidebar', function() {
    return {
      restrict: 'E',
      templateUrl: './src/Sidebar.html'
    };
  });
