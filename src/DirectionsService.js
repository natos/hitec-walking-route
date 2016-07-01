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
  function reorder() {

    var route = directionsModel.route;
    var selectedPlaces = [];
    var waypoints = placesService.getWaypoints();

    // reorder waypoints
    for (var i = 0; i < route.waypoint_order.length; i += 1) {
      var place = waypoints[route.waypoint_order[i]];
      selectedPlaces.push(place);
      markersService.getMarker(place).order(i + 2);
    }

    // add start place
    var startPlaceMarker, startPlace = placesService.getStartPlace();
    if (startPlace) {
      startPlaceMarker = markersService.getMarker(startPlace);
      if (startPlaceMarker) {
        startPlaceMarker.order(1);
        selectedPlaces.unshift(startPlace);
      }
    }

    // add end place
    // TODO: What should happen when start place equals end place?
    var endPlaceMarker, endPlace = placesService.getEndPlace();
    if (endPlace) {
      endPlaceMarker = markersService.getMarker(endPlace);
      if (endPlaceMarker) {
        selectedPlaces.push(endPlace);
        endPlaceMarker.order(waypoints.length + 2);
      }
    }

    // get place information for direcctions
    var i, t = route.legs.length;
    for (i = 0; i < t; i += 1) {
      route.legs[i].start_place = placesService.getPlaceByOrder(i+1);
      route.legs[i].end_place = placesService.getPlaceByOrder(i+2);
    }

    // update selected places render
    $rootScope.selected.places = selectedPlaces;
    if (!$rootScope.$$phase) $rootScope.$apply();
  }

  /**
   * Render direcctions from Google API
   * @param response Response object
   * @param status HTTP status code
   * @public
   */
  function displayDirections(response, status) {

    if (status === google.maps.DirectionsStatus.OK) {

      // comunicate state
      $rootScope.$emit(directionsModel.events.displayingDirections);

      // display direcctions
      directionsDisplay.setDirections(response);

      // save route information
      directionsModel.route = response.routes[0];

      // collect time and distance info
      collectTimeAndDistance();

      // reorder points and places
      reorder();

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
      $rootScope.$emit(directionsModel.events.calculatingDirectionsEnd);
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

  // function getStaticMapWithDirections() {
  //     var url = 'https://maps.googleapis.com/maps/api/staticmap?';
  //     url += 'center=52.370216,4.895168'; // center in Amsterdam
  //     // url += '&zoom=14';
  //     url += '&size=640x640';
  //     url += '&path=weight:3%7Ccolor:0xCC0000%7Cenc:' + route.overview_polyline;
  //     url += '&key=' + mapModel.API_KEY;
  //     return url;
  // }

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
    // getStaticMapWithDirections: getStaticMapWithDirections,
    calculateAndDisplayRoute: calculateAndDisplayRoute,
    getTotalDistance: getTotalDistance,
    getTotalDuration: getTotalDuration,
    getCurrentRoute: getCurrentRoute
  };
}
