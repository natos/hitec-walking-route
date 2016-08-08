angular
  .module('App')
  .controller('StaticMapController', [
    '$scope', '$rootScope', '$window', '$timeout',
    'appModel', 'mapModel',
    'mapService', 'directionsService',
    StaticMapController
  ]);

/**
 * Static Map Controller for Hi-Tec Walking Route
 * @param $scope
 * @param avatarsService
 * @constructor
 */
function StaticMapController($scope, $rootScope, $window, $timeout, appModel, mapModel, mapService, directionsService) {

  if (!google || !google.maps) {
    console.error('Google Maps API is unavailable.');
  }

  function resizeMap() {
    $timeout(triggerResize, 1);
    $timeout(mapService.getReady, 2);
  }

  function donePrinting() {
    angular.element(document.getElementById('map-container')).removeClass('printing-size');
    $timeout(resizeMap, 10);
  }

  function triggerResize() {
    window.dispatchEvent(new Event('resize'));
  }

  var self = this;

  // self.staticMapURL = directionsService.getStaticMapWithDirections();

  self.cancel = function() {
    $rootScope.$emit(appModel.events.prevState);
  };

  self.print = function() {
    angular.element(document.getElementById('map-container')).addClass('printing-size');
    $timeout(resizeMap, 10);
    $timeout($window.print, 100);
  };

  $scope.$on('$destroy', function iVeBeenDismissed() {
    window.onbeforeprint = null;
    window.onafterprint = null;
  });

  (function() {
    var beforePrint = function() {
      // console.log('Functionality to run before printing.');
    };
    var afterPrint = function() {
      $timeout(donePrinting, 100);
    };

    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
          beforePrint();
        } else {
          afterPrint();
        }
      });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
  }());

}
