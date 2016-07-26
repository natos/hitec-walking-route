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
      markersService.cleanMarkers();
      markersService.createMarkers();
      markersService.dropYourLocationPin();
      directionsService.calculateAndDisplayRoute();
      transitionToRoute();
    }
    if (appModel.state.isReviewing() || appModel.state.isPrinting()) {
      // if any dialog is open
      closeDialog();
      // adjust UI
      if (appModel.state.isReviewing()) {
        angular.element(document.getElementById('map')).removeClass('printing');
      }
      if (appModel.state.isPrinting()) {
        angular.element(document.getElementById('map')).addClass('printing');
      }
      // sidebar will show or hide
      // trigger behaviors to fix map positining
      $timeout(triggerResize, 1);
      $timeout(mapService.getReady, 2);
    } else {
      unsetReady();
    }
    if (appModel.state.isReviewing()) {
      setReady();
    }
    // apply state change
    if (!$rootScope.$$phase) $rootScope.$apply();
  }

  function triggerResize() {
    window.dispatchEvent(new Event('resize'));
  }

  function centerMap() {
    $rootScope.$broadcast(mapModel.events.center);
  }

  function startOver() {
    $rootScope.$broadcast(mapModel.events.restart);
    self.ready = false;
  }

  function unsetReady() {
    self.ready = false;
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
      self.ready = false;
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
        $scope.value = 90;
        $scope.bufferValue = 100;
        $timeout(function () {
          $scope.ready = true;
          self.ready = true;
        }, 200);
      });

    }
  }

  /* delegate */

  $rootScope.$on(appModel.events.stateChanged, currentStateChanged);

}
