(function(){

  'use strict';

  angular.module('map')
    .service('directionsService', [
      '$rootScope', 'mapService', 'markersService',
      DirectionsService
    ]);

  /**
   * Directions DataService
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function DirectionsService($rootScope, mapService, markersService) {

    if (!google || !google.maps) {
      console.error('Google Maps API is unavailable.');
    }

    var API_KEY = 'AIzaSyCcara1t7Tt4Y6iexHJvLGBo_zfW4O6eQo';

    var rawRoute;
    var totalDuration = 0;
    var totalDistance = 0;

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

      var directions = {
          travelMode: google.maps.TravelMode.WALKING
      };
      var waypts = [];
      var selectedMarkers = markersService.getSelectedMarkers();

      for (var i = 0; i < selectedMarkers.length; i++) {
        var marker = selectedMarkers[i];
        waypts.push({
            location: new google.maps.LatLng(marker.mark.position.lat, marker.mark.position.lng),
            stopover: true
        });
      }

      if (selectedMarkers.length <= 1) {
        directionsDisplay.set('directions', null);
        $rootScope.$emit('directionsService:calculating-route-end');
        return;
      }

      var origin = waypts.shift().location;
      var destination = waypts.pop().location;

      if (origin) {
        directions.origin = origin;
      } else {
        console.error('DirectionsService', 'Origin field is empty');
      }

      if (destination) {
        directions.destination = destination;
      } else {
        console.error('DirectionsService', 'Destination field is empty');
      }

      if (waypts.length) {
        directions.waypoints = waypts;
        if (optimizeWaypoints) {
          directions.optimizeWaypoints = optimizeWaypoints;
        }
      }

      directionsService.route(directions, function(response, status) {
        $rootScope.$emit('directionsService:calculating-route-end');
        if (status === google.maps.DirectionsStatus.OK) {
          console.log('directions response', response)
          directionsDisplay.setDirections(response);
          rawRoute = response.routes[0];
          // var summaryPanel = document.getElementById('directions-panel');
          // summaryPanel.innerHTML = '';

          // For each route, display summary information.
          // for (var i = 0; i < rawRoute.legs.length; i++) {
          //     totalDuration += rawRoute.legs[i].duration.value / 60; // to minutes
          //     totalDistance += rawRoute.legs[i].distance.value / 1000; // to km
              // var routeSegment = i + 1;
              // summaryPanel.innerHTML += rawRoute.legs[i].duration.text + ': <b>Route Segment: ' + routeSegment + '</b><br>';
              // summaryPanel.innerHTML += rawRoute.legs[i].start_address + ' to ';
              // summaryPanel.innerHTML += rawRoute.legs[i].end_address + '<br>';
              // summaryPanel.innerHTML += rawRoute.legs[i].distance.text + '<br><br>';
          // }

          // totalDurationMin += rawRoute.legs[0].duration.value / 60; // to minutes
          // totalDistanceMiles += rawRoute.legs[0].distance.value / 1000; // to km
          // for (var i = 0; i < rawRoute.legs[0].steps.length; i++) {
          //   console.log('step', step)
          //   var step = rawRoute.legs[0].steps[i];
          //   var $step = document.createElement('div');
          //   if (step.maneuver && step.maneuver !== '') {
          //     $step.className = step.maneuver;
          //   }
          //   $step.innerHTML += '<p>' + step.instructions + '<br>' + step.distance.text + ' / ' + step.duration.text + '</p>';
          //   summaryPanel.appendChild($step);
          // }
          // var totals = document.getElementById('totals');
          // totals.innerHTML = '<p>' + (Math.round(totalDistanceMiles * 10) / 10) + 'km / ' + (Math.round(totalDurationMin * 100) / 100) + ' min</p>';
          // console.log(Math.round(totalDistance * 10) / 10, 'km / ', Math.round(totalDuration * 100) / 100, ' min');
        } else {
          console.error('Directions request failed due to ' + status, response);
        }
      });
    }

    function optimizeCurrentRoute() {
      optimizeWaypoints = true;
      console.log('optimizeWaypoints')
      calculateAndDisplayRoute()
      optimizeWaypoints = false;
    }

    function cleanRoute() {
      directionsDisplay.set('directions', null);
    }

    function getCurrentDirections() {
      return rawRoute;
    }

    function getStaticMapWithDirections() {
        var url = 'https://maps.googleapis.com/maps/api/staticmap?';
        url += 'center=52.370216,4.895168'; // center in Amsterdam
        // url += '&zoom=14';
        url += '&size=640x640';
        url += '&path=weight:3%7Ccolor:0xCC0000%7Cenc:' + rawRoute.overview_polyline;
        url += '&key=' + API_KEY;
        return url;
    }


    // delegate
    $rootScope.$on('mapController:restart-map', cleanRoute);
    $rootScope.$on('markersService:toggled-mark', calculateAndDisplayRoute);
    $rootScope.$on('mapController:optimize-route', optimizeCurrentRoute);

    // public interface
    return {
      cleanRoute: cleanRoute,
      getStaticMapWithDirections: getStaticMapWithDirections,
      calculateAndDisplayRoute: calculateAndDisplayRoute,
      optimizeCurrentRoute: optimizeCurrentRoute,
      getCurrentDirections: getCurrentDirections
    };
  }

})();
