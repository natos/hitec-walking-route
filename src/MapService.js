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

  function getMap() {
    if (mapModel.map) { return mapModel.map; }
    mapModel.map = new google.maps.Map(document.getElementById('map'), mapModel.config);
    mapModel.map.setOptions({ "styles": mapModel.styles });
    return mapModel.map;
  }

  function centerMap() {
    var map = getMap();
    if (!map) { return; }
    map.setCenter(locationService.getCurrentLocation() || mapModel.config.center);
    map.setZoom(mapModel.config.zoom);
    return map;
  }

  function getReady() {
    var map = getMap();
    if (!map) { return; }
    google.maps.event.trigger(map, 'resize');
    centerMap();
    return map;
  }

  // delegate
  $rootScope.$on(mapModel.events.center, centerMap);

  // adjust map on window events
  google.maps.event.addDomListener(window, "resize", getReady);

  // public interface
  return {
    getMap: getMap,
    centerMap: centerMap,
    getReady: getReady
  };
}
