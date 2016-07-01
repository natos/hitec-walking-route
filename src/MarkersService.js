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
    if (!location) return;
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
  }

  function cleanUnselectedMarkers() {
    for (var i = 0; i < markers.length; i += 1) {
      if (!markers[i].mark.selected) {
        clearMarker(markers[i])
      }
    }
  }

  // remove marker from the map
  function clearMarker(marker) {
    if (typeof marker.mark === 'undefined') {
      marker = getMarker(marker);
    }
    marker.setMap(null);
  }
  // remove markers from the map
  function clearMarkers() {
    for (var i = 0; i < markers.length; i += 1) {
      clearMarker(markers[i]);
    }
  }

  // unselect markers
  function cleanMarkers() {
    // markersModel.markers.push(marker);
    for (var i = 0; i < markersModel.markers.length; i += 1) {
      console.log('cleanning marker', markersModel.markers[i])
      markersModel.markers[i]
        .unselect()
        .remove();
    }
    markersModel.markers.splice(0, markersModel.markers.length);
    $rootScope.$emit(markersModel.events.cleaned);
    console.log('cleaned markers', markersModel.markers)
  }

  function restartMarkers() {
    cleanMarkers();
    $timeout(function () {
      createMarkers();
    });
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
      console.log('Address = Location', markersModel.markers[i].place.address, location);
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

  /* delegate */

  $rootScope.$on(mapModel.events.restart, restartMarkers);
  $rootScope.$on('mapController:restart-map', restartMarkers);

  // public interface
  return {
    getMarker: getMarker,
    createMarkers: createMarkers,
    maximizeMarker: maximizeMarker,
    dropYourLocationPin: dropYourLocationPin,
    getMarkerByLocation: getMarkerByLocation,
    getMarkerByOrder: getMarkerByOrder
  };
}
