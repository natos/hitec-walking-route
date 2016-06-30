angular
  .module('App')
  .controller('MapController', [
    '$scope', '$rootScope', '$window',
    'appModel', 'mapModel', 'directionsModel',
    'mapService', 'markersService', 'directionsService', 'placesService',
    '$mdDialog', '$timeout', '$interval',
    MapController
  ]);

/**
 * Map Controller for Hi-Tec Walking Route
 * @param $scope
 * @param avatarsService
 * @constructor
 */
function MapController($scope, $rootScope, $window, appModel, mapModel, directionsModel, mapService, markersService, directionsService, placesService, $mdDialog, $timeout, $interval) {

  if (!google || !google.maps) {
    console.error('Google Maps API is unavailable.');
  }

  var self = this;

      self.ready = false;
      self.map = mapService.getMap();
      self.center = centerMap;
      self.startOver = startOver;
      self.showPlace = showPlace;

  function currentStateChanged() {
    if (appModel.state.isLoadingDirections()) {
      markersService.createMarkers();
      markersService.dropYourLocationPin();
      directionsService.calculateAndDisplayRoute();
      mapService.getReady();
      transitionToRoute();
    }
    if (appModel.state.isReviewing()) {
      $timeout(centerMap);
      $timeout(closeDialog, 700);
      $timeout(setReady, 1500);
    }
    if (appModel.state.isPrinting()) {
      $timeout(function() { window.dispatchEvent(new Event('resize')); });
    }
    // apply state change
    if (!$rootScope.$$phase) $rootScope.$apply();
  }

  function print() {
    $rootScope.$broadcast('mapController:print');
    $window.print();
  }

  function setPrintMode() {
    $rootScope.$broadcast('mapController:set-print-mode');
    // self.staticMapURL = directionsService.getStaticMapWithDirections();
    // self.directions = directionsService.calculateDirections().get();
    $timeout(function() {
      self.printMode = true;
    });
  }

  function unsetPrintMode() {
    self.directions = null;
    self.printMode = false;
    $rootScope.$broadcast('mapController:unset-print-mode');
  }

  function centerMap() {
    $rootScope.$broadcast('mapController:center-map');
  }

  function startOver() {
    $rootScope.$broadcast(mapModel.events.restart);
    console.log('restart');
    self.ready = false;
    appModel.setState(3);
  }

  function setReady() {
    self.ready = true;
    $rootScope.$broadcast(mapModel.events.ready);
  }

  function showPlace(place) {
    markersService.maximizeMarker(place.id);
  }

  function closeDialog() {
    $mdDialog.hide();
  }

  /**
   * Cancel routing
   */
  var transitionInterval;
  function cancelTransition() {
    closeDialog();
    $interval.cancel(transitionInterval);
    $rootScope.$emit(appModel.events.prevState);
  }

  function transitionToRoute(event) {

    $mdDialog
      .show({
        controller: ['$scope', '$mdDialog', LoadingRouteController],
        parent: '#map-container',
        templateUrl: 'src/LoadingRoute.html'
      });

    /**
     * Show Route controller
     */
    function LoadingRouteController($scope, $mdDialog) {
      $scope.cancel = cancelTransition;
      $scope.ready = false;
      $scope.value = 0;
      $scope.bufferValue = 10;
      transitionInterval = $interval(function() {
        $scope.value += 3;
        $scope.bufferValue += 3.333;
        if ($scope.value >= 100 && $scope.ready) {
          $interval.cancel(transitionInterval);
          $timeout(function() {
            $rootScope.$emit(appModel.events.nextState);
          }, 500);
        } else if ($scope.value >= 100 && !$scope.ready) {
          $scope.value = 30;
          $scope.bufferValue = 50;
        }
      }, 100, 0, true);

      $rootScope.$on(directionsModel.events.displayedDirections, function() {
        $scope.ready = true;
        $scope.value = 90;
        $scope.bufferValue = 100;
      });

    }
  }

  /* delegate */

  $rootScope.$on(appModel.events.stateChanged, currentStateChanged);

}
