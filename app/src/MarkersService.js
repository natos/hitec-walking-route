(function() {
  'use strict';

  angular.module('App')
    .service('markersService', [
      '$rootScope', '$timeout',
      'appModel', 'markersModel', 'directionsModel',
      'mapService', 'placesService', 'locationService', 'directionsService',
      'Marker',
      MarkersService
    ]);

  /**
   * Markers DataService
   *
   * @returns {{getMarkers: Function}}
   * @constructor
   */
  function MarkersService($rootScope, $timeout, appModel, markersModel, directionsModel, mapService, placesService, locationService, directionsService, Marker) {

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

      var route = directionsService.getCurrentRoute();
      var waypoints = placesService.getWaypoints();

      var startPlace = getMarker(placesService.getStartPlace());
      if (startPlace) {
        startPlace.order(1);
      }

      var endPlace = getMarker(placesService.getEndPlace());
      if (endPlace) {
        endPlace.order(waypoints.length + 2);
      }

      for (var i = 0; i < waypoints.length; i += 1) {
        var marker = getMarker(waypoints[i]);
        // console.log('marker', marker, route.waypoint_order[i] + 2);
        if (marker) {
          marker.order(route.waypoint_order[i] + 2);
        }
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
      for (var i = 0; i < selectedMarkers.length; i += 1) {
        selectedMarkers[i].setLabel('');
        unselectMarkerPin(selectedMarkers[i], i);
      }
      selectedMarkers.splice(0, selectedMarkers.length);
      $rootScope.$emit('markersService:cleaned-markers');
    }

    function restartMarkers() {
      // isFiltering = false;
      cleanMarkers();
      // cleanFilteredMarkers();
      $timeout(function () {
        dropMarkers();
      });
    }

    /* delegate */

    $rootScope.$on(directionsModel.events.displayedDirections, reorderMarkersFromRoute);
    $rootScope.$on('mapController:restart-map', restartMarkers);
    $rootScope.$on('mapController:set-print-mode', cleanUnselectedMarkers);
    $rootScope.$on('mapController:unset-print-mode', recoverMarkers);
    // $rootScope.$on('categoriesService:updated', filterByCategories);


    // public interface
    return {
      dropMarkers: dropMarkers,
      createMarkers: createMarkers,
      dropYourLocationPin: dropYourLocationPin,
      reorderMarkersFromRoute: reorderMarkersFromRoute
    };
  }

})();
