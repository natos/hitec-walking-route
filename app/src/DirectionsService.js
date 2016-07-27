angular
  .module('App')
  .service('directionsService', [
    '$rootScope',
    'mapModel', 'directionsModel',
    'mapService', 'placesService', 'markersService',
    DirectionsService
  ]);

/**
 * Directions DataService
 *
 * @returns {{loadAll: Function}}
 * @constructor
 */
function DirectionsService($rootScope, mapModel, directionsModel, mapService, placesService, markersService) {

  if (!google || !google.maps) {
    console.error('Google Maps API is unavailable.');
  }

  /**
   * Directions Service
   * @public
   */
  var directionsService = new google.maps.DirectionsService;

  /**
   * Collect time and distance information from route
   * @public
   */
  var directionsDisplay = new google.maps.DirectionsRenderer;

  directionsDisplay.setMap(mapService.getMap());
  directionsDisplay.setOptions(directionsModel.options);

  /**
   * Collect time and distance information from route
   * @public
   */
  function collectTimeAndDistance() {
    // Collect time and distance information
    for (var i = 0; i < directionsModel.route.legs.length; i++) {
        directionsModel.duration.value += directionsModel.route.legs[i].duration.value / 60; // to minutes
        directionsModel.distance.value += directionsModel.route.legs[i].distance.value / 1000; // to km
    }
    directionsModel.duration.min = (Math.round(directionsModel.duration.value * 100) / 100);
    directionsModel.distance.km = (Math.round(directionsModel.distance.value * 10) / 10);
  }

  /**
   * Reorder if waypoints got omtimized
   * @public
   */
  function reorderIfNeeded() {

    var route = directionsModel.route;
    // var route = angular.extend({}, directionsModel.route);
    var waypoints = placesService.getWaypoints();

    var endPlaceMarker, endPlace = placesService.getEndPlace();
    if (endPlace) {
      // console.log('endPlace', endPlace);
      endPlaceMarker = markersService.getMarker(endPlace);
      if (endPlaceMarker) {
        endPlaceMarker.order(waypoints.length + 2);
      }
    }

    var startPlaceMarker, startPlace = placesService.getStartPlace();
    if (startPlace) {
      // console.log('startPlace', startPlace);
      startPlaceMarker = markersService.getMarker(startPlace);
      if (startPlaceMarker) {
        startPlaceMarker.order(1);
      }
    }

    var waypoint;
    for (var i = 0; i < waypoints.length; i += 1) {
      if (waypoints[i]) {
        // console.log('waypoint', route.waypoint_order[i] + 2, waypoint);
        var waypointMarker = markersService.getMarker(waypoints[i]);
        // console.log('marker', marker, route.waypoint_order[i] + 2);
        if (waypointMarker) {
          waypointMarker.order(route.waypoint_order[i] + 2);
        }
      }
    }

    for (var i = 0; i < route.legs.length; i += 1) {
      if (i === 0) {
        // console.log('first leg start place')
        route.legs[i].start_place = startPlace;
      } else if (waypoints[i-1]) {
        // console.log('first leg is waypoing', waypoints[i-1])
        route.legs[i].start_place = waypoints[i-1];
      } else if ((i+1) === route.legs.length) {
        // console.log('last leg is end place')
        route.legs[i].end_place = endPlace;
      } else if (waypoints[i]) {
        // console.log('last leg is waypoint', waypoints[i-1])
        route.legs[i].end_place = waypoints[i-1];
      }
    }

    placesService.sortSelectedPlacesByOrder();
  }

  /**
   * Render direcctions from Google API
   * @param response Response object
   * @param status HTTP status code
   * @public
   */
  function displayDirections(response, status) {

    if (status === google.maps.DirectionsStatus.OK) {

      // console.log('response', response);

      // comunicate state
      $rootScope.$emit(directionsModel.events.displayingDirections);

      // display direcctions
      directionsDisplay.setDirections(response);

      // save route information
      directionsModel.route = response.routes[0];

      // reorder points and places
      reorderIfNeeded();

      // collect time and distance info
      collectTimeAndDistance();

      // comunicate state
      $rootScope.$emit(directionsModel.events.displayedDirections);

    } else {
      console.error('Directions request failed due to ' + status, response);
      // comunicate state
      $rootScope.$emit(directionsModel.events.displayingdDirectionsError);
    }
  }

  /**
   * Get direcctions from Google API
   * @public
   */
  function calculateAndDisplayRoute() {

    $rootScope.$emit(directionsModel.events.calculatingDirections);

    // get selected places
    var waypoints = placesService.getWaypoints();
    var origin = placesService.getStartPlace();
    var destination = placesService.getEndPlace();

    // make sure there's an origin and destination
    if (!origin || !destination) {
      directionsDisplay.set('directions', null);
      $rootScope.$emit('directionsService:calculating-route-end');
      return;
    }

    // create the request object
    var directions = {
        travelMode: google.maps.TravelMode.WALKING,
        optimizeWaypoints: true,
        origin: origin.place.location,
        destination: destination.place.location,
        waypoints: []
    };

    // attach all the waypoints
    for (var i = 0; i < waypoints.length; i += 1) {
      directions.waypoints.push({
          location: waypoints[i].place.location,
          stopover: true
      });
    }

    $rootScope.$emit(directionsModel.events.gettingDirections);
    // trigger the request to the API
    directionsService.route(directions, displayDirections);
  }

  function cleanRoute() {
    directionsDisplay.set('directions', null);
  }

  function getStaticMapWithDirections() {
      var url = 'https://maps.googleapis.com/maps/api/staticmap?';
      url += 'center=52.370216,4.895168'; // center in Amsterdam
      // url += '&zoom=14';
      url += '&size=640x640';
      url += '&path=weight:3%7Ccolor:0xCC0000%7Cenc:' + route.overview_polyline;
      url += '&key=' + mapModel.API_KEY;
      return url;
  }

  function getTotalDistance() {
    return directionsModel.distance;
  }

  function getTotalDuration() {
    return directionsModel.duration;
  }

  function getCurrentRoute() {
    return directionsModel.route;
  }

  // delegate
  $rootScope.$on('mapController:restart-map', cleanRoute);
  // $rootScope.$on('markersService:toggled-mark', calculateAndDisplayRoute);
  // $rootScope.$on('markersService:dropped-pins', calculateAndDisplayRoute);

  // public interface
  return {
    cleanRoute: cleanRoute,
    getStaticMapWithDirections: getStaticMapWithDirections,
    calculateAndDisplayRoute: calculateAndDisplayRoute,
    getTotalDistance: getTotalDistance,
    getTotalDuration: getTotalDuration,
    getCurrentRoute: getCurrentRoute
  };
}
