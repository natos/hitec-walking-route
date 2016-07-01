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

  // return true if the mark is selected
  function isMarkerSelected(marker) {
    return isMarkSelected(marker.mark);
  }

  // return true if the mark is selected
  function isMarkSelected(mark) {
    var selectedPlaces = placesService.getSelectedPlaces();
    for (var i = 0; i < selectedPlaces.length; i += 1) {
      if (selectedPlaces[i].id === mark.id) {
        return true;
      }
    }
    return false;
  }

  // finds a specific marker given a place
  function getMarker(place) {
    for (var i = 0; i < markersModel.markers.length; i += 1) {
      if (markersModel.markers[i].place.id === place.id) {
        return markersModel.markers[i];
      }
    }
  }

  function removeOrderFromMarkers() {
    for (var i = 0; i < markersModel.markers.length; i += 1) {
      markersModel.markers[i].pin.setLabel('');
    }
  }

  // reorder markers numbers
  function reorderMarkers() {
    for (var i = 0; i < markersModel.selectedMarkers.length; i += 1) {
      markersModel.selectedMarkers[i].mark.order = i + 1;
      markersModel.selectedMarkers[i].setLabel({
        color: '#ffffff',
        text: '' + (i + 1)
      });
    }
  }

  function reorderMarkersFromRoute() {

    removeOrderFromMarkers()

    var route = directionsModel.route;
    // var route = angular.extend({}, directionsModel.route);
    var waypoints = placesService.getWaypoints();

    var startPlace = getMarker(placesService.getStartPlace());
    if (startPlace) {
      startPlace.order(1);
      console.log('marker order', 1, startPlace.place.label);
    }

    console.log('waypoint order', route.waypoint_order);

    for (var i = 0; i < route.waypoint_order.length; i += 1) {
      var marker = getMarker(waypoints[i]);
      if (marker) {
        marker.order(route.waypoint_order[i] + 2);
        console.log('marker order', route.waypoint_order[i] + 2, marker.place.label);
      }
    }

    var endPlace = getMarker(placesService.getEndPlace());
    if (endPlace && endPlace !== startPlace) {
      endPlace.order(waypoints.length + 2);
      console.log('marker order', waypoints.length + 2, endPlace.place.label);
    }
  }

  var drops = 0;
  function areAllMarkersDropped(i, t) {
    drops += 1;
    if (drops === t) {
      $rootScope.$emit('markersService:dropped-pins');
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
    // console.log('Created Markers', markersModel.markers);
  }

  // create a collection of markers
  function dropMarkers(m) {
    var m = m || placesService.getPlaces();
    var t = m.length;
    for (var i = 0; i < t; i += 1) {
      createMarker(m[i], i, t);
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

  function recoverMarkers() {
    clearMarkers();
    $timeout(function () {
      dropMarkers();
    });
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
    // isFiltering = false;
    cleanMarkers();
    // cleanFilteredMarkers();
    $timeout(function () {
      createMarkers();
    });
  }

  function maximizeMarker(place_id) {
    // var position = markersModel.markers.indexOf(place);
    // markersModel.markers[position].maximize();

    for (var i = 0; i < markersModel.markers.length; i += 1) {
      if (markersModel.markers[i]) {
        if (place_id === markersModel.markers[i].place.id) {
          return markersModel.markers[i].maximize();
        }
      }
    }
    // console.log('markersModel.markers[position]', markersModel.markers[position])
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

  /* delegate */

  $rootScope.$on(mapModel.events.restart, restartMarkers);
  // $rootScope.$on(directionsModel.events.displayedDirections, reorderMarkersFromRoute);
  $rootScope.$on('mapController:restart-map', restartMarkers);
  $rootScope.$on('mapController:set-print-mode', cleanUnselectedMarkers);
  $rootScope.$on('mapController:unset-print-mode', recoverMarkers);
  // $rootScope.$on('categoriesService:updated', filterByCategories);


  // public interface
  return {
    getMarker: getMarker,
    dropMarkers: dropMarkers,
    createMarkers: createMarkers,
    maximizeMarker: maximizeMarker,
    dropYourLocationPin: dropYourLocationPin,
    // reorderMarkersFromRoute: reorderMarkersFromRoute,
    getMarkerByLocation: getMarkerByLocation
  };
}
