angular
  .module('App')
  .service('markersService', [
    '$rootScope', '$timeout',
    'appModel', 'markersModel', 'directionsModel', 'mapModel',
    'mapService', 'placesService', 'locationService',
    'Marker',
    MarkersService
  ]);

/**
 * Markers DataService
 *
 * @returns {{getMarkers: Function}}
 * @constructor
 */
function MarkersService($rootScope, $timeout, appModel, markersModel, directionsModel, mapModel, mapService, placesService, locationService, Marker) {

  // finds a specific marker given a place
  function getMarker(place) {
    for (var i = 0; i < markersModel.markers.length; i += 1) {
      if (markersModel.markers[i].place.id === place.id) {
        return markersModel.markers[i];
      }
    }
  }

  function createMarkers() {
    if (markersModel.markers.length) {
      return;
    }
    var places = placesService.getPlaces();
    for (var i = 0; i < places.length; i += 1) {
      var marker = new Marker(places[i]).render(mapService.getMap());
      markersModel.markers.push(marker);
    }
  }

  function dropYourLocationPin() {
    var location = locationService.getCurrentLocation();
    if (!location || markersModel.yourPin) return;
    new google.maps.Marker({
      map: mapService.getMap(),
      position: location,
      clickeable: false,
      icon: {
        path: markersModel.iconPath.yourLocation,
        scale: 1,
        strokeWeight: 0,
        fillColor: '#037AFF',
        fillOpacity: .9
      }
    });
    markersModel.yourPin = true;
  }

  // unselect markers
  function cleanMarkers() {
    for (var i = 0; i < markersModel.markers.length; i += 1) {
      markersModel.markers[i].remove();
    }
    markersModel.markers.splice(0, markersModel.markers.length);
    $rootScope.$emit(markersModel.events.cleaned);
  }

  function maximizeMarker(place_id) {
    for (var i = 0; i < markersModel.markers.length; i += 1) {
      if (markersModel.markers[i]) {
        if (place_id === markersModel.markers[i].place.id) {
          return markersModel.markers[i].maximize();
        }
      }
    }
  }

  function getMarkerByLocation(location) {
    for (var i = 0; i < markersModel.markers.length; i += 1) {
      if (markersModel.markers[i].place.address.indexOf(location) >= 0 || location.indexOf(markersModel.markers[i].place.address) >= 0) {
        return angular.extend({}, markersModel.markers[i]);
      }
    }
    return false;
  }

  function getMarkerByOrder(order) {
    for (var i = 0; i < markersModel.markers.length; i += 1) {
      if (markersModel.markers[i].place.order === order) {
        return markersModel.markers[i];
      }
    }
    return false;
  }

  // public interface
  return {
    getMarker: getMarker,
    cleanMarkers: cleanMarkers,
    createMarkers: createMarkers,
    maximizeMarker: maximizeMarker,
    dropYourLocationPin: dropYourLocationPin,
    getMarkerByLocation: getMarkerByLocation,
    getMarkerByOrder: getMarkerByOrder
  };
}
