angular
  .module('App')
  .directive('backgroundImage', function() {
    return function (scope, element, attrs) {
      element.css({
        'background-image': 'url(' + attrs.backgroundImage + ')',
        'background-repeat': 'no-repeat'
      });
    };
});
