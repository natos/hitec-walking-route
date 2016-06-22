angular
  .module('App')
  .service('mapService', [
    '$rootScope', '$window', '$timeout',
    'mapModel',
    'locationService',
    MapService
  ]);

/**
 * Map Service
 * @constructor
 */
function MapService($rootScope, $window, $timeout, mapModel, locationService) {

  function centerMap() {
    var map = getMap();
    map.setCenter(locationService.getCurrentLocation() || mapModel.config.center);
    map.setZoom(mapModel.config.zoom);
    return map;
  }

  function getMap() {
    if (mapModel.map) { return mapModel.map; }
    mapModel.map = new google.maps.Map(document.getElementById('map'), mapModel.config);
    mapModel.map.setOptions({ "styles": mapModel.styles });
    return mapModel.map;
  }

  function getReady() {
    if (mapModel.map) { return; }
    google.maps.event.trigger(mapModel.map, 'resize');
    $timeout(centerMap);
  }

  // delegate
  $rootScope.$on('mapController:center-map', centerMap);
  $rootScope.$on('markersService:cleaned-markers', centerMap);

  angular.element($window).bind('resize', getReady);

  // public interface
  return {
    getMap: getMap,
    centerMap: centerMap,
    getReady: getReady
  };
}
