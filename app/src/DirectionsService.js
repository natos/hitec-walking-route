(function(){

  'use strict';

  angular.module('App')
    .service('directionsService', [
      '$rootScope',
      'mapService', 'markersService', 'placesService',
      DirectionsService
    ]);

  /**
   * Directions DataService
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function DirectionsService($rootScope, mapService, markersService, placesService) {

    if (!google || !google.maps) {
      console.error('Google Maps API is unavailable.');
    }

    var API_KEY = 'AIzaSyCcara1t7Tt4Y6iexHJvLGBo_zfW4O6eQo';

    var route;
    var totalDuration = { value: 0, min: 0 };
    var totalDistance = { value: 0, min: 0 };

    var optimizeWaypoints;

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(mapService.getMap());
    directionsDisplay.setOptions({
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: {
        strokeWeight: 5,
        strokeOpacity: .75,
        strokeColor: "#CC0000"
      }
    });

    function calculateAndDisplayRoute() {


      $rootScope.$emit('directionsService:calculating-route');

      var selectedPlaces = placesService.getSelectedPlaces();
      console.log('selectedPlaces', selectedPlaces)

      var origin = placesService.getStartPlace();

      var destination = placesService.getEndPlace();

      console.log('origin', origin)
      console.log('destination', destination)

      var directions = {
          travelMode: google.maps.TravelMode.WALKING,
          origin: origin.place.location,
          destination: destination.place.location,
          optimizeWaypoints: true,
          waypoints: []
      };

      if (!selectedPlaces) {
        console.log('No selections, cant calculate route');
        return;
      }

      for (var i = 0; i < selectedPlaces.length; i += 1) {
        var marker = selectedPlaces[i];
        directions.waypoints.push({
            location: marker.place.location,
            stopover: true
        });
      }

      if (selectedPlaces.length <= 1) {
        directionsDisplay.set('directions', null);
        $rootScope.$emit('directionsService:calculating-route-end');
        return;
      }

      console.log('Asking for direcctions', directions);

      directionsService.route(directions, function(response, status) {
        $rootScope.$emit('directionsService:calculating-route-end');
        if (status === google.maps.DirectionsStatus.OK) {
          console.log('directions response', response)
          directionsDisplay.setDirections(response);
          // rawRoute = response.routes[0];
          route = response.routes[0];
          markersService.reorderMarkersFromRoute(route);
          // Collect time and distance information
          for (var i = 0; i < route.legs.length; i++) {
              totalDuration.value += route.legs[i].duration.value / 60; // to minutes
              totalDistance.value += route.legs[i].distance.value / 1000; // to km
          }
          totalDistance.km = (Math.round(totalDistance.value * 10) / 10);
          totalDuration.min = (Math.round(totalDuration.value * 100) / 100);

        } else {
          console.error('Directions request failed due to ' + status, response);
        }
      });
    }

    function cleanRoute() {
      directionsDisplay.set('directions', null);
    }

    function calculateDirections() {
      var _route = angular.extend({}, route);
      _route.totalDistance = getTotalDistance();
      _route.totalDuration = getTotalDuration();
      // attach markers for each leg
      for (var i = 0; i < _route.legs.length; i += 1) {
        var start_marker = markersService.getMarkerByLocation(rawRoute.legs[i].start_address);
        var end_marker = markersService.getMarkerByLocation(rawRoute.legs[i].end_address);
        if (start_marker) {
          _route.legs[i].start_marker = start_marker;
        }
        if (end_marker) {
          _route.legs[i].end_marker = end_marker;
        }
      }
      return {
        get: function() {
          return _route;
        }
      };
    }

    function getStaticMapWithDirections() {
        var url = 'https://maps.googleapis.com/maps/api/staticmap?';
        url += 'center=52.370216,4.895168'; // center in Amsterdam
        // url += '&zoom=14';
        url += '&size=640x640';
        url += '&path=weight:3%7Ccolor:0xCC0000%7Cenc:' + route.overview_polyline;
        url += '&key=' + API_KEY;
        return url;
    }

    function getTotalDistance() {
      return totalDistance;
    }

    function getTotalDuration() {
      return totalDuration;
    }

    function getRouteInfo() {
      return route;
    }

    // delegate
    $rootScope.$on('mapController:restart-map', cleanRoute);
    // $rootScope.$on('markersService:toggled-mark', calculateAndDisplayRoute);
    $rootScope.$on('markersService:dropped-pins', calculateAndDisplayRoute);

    // public interface
    return {
      cleanRoute: cleanRoute,
      getStaticMapWithDirections: getStaticMapWithDirections,
      calculateAndDisplayRoute: calculateAndDisplayRoute,
      calculateDirections: calculateDirections,
      getTotalDistance: getTotalDistance,
      getTotalDuration: getTotalDuration,
      getRouteInfo: getRouteInfo
    };
  }

})();
