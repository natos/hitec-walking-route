(function(){

  'use strict';

  angular.module('map')
    .service('directionsService', [
      '$rootScope', 'mapService', 'markersService',
      directionsService
    ]);

  /**
   * Directions DataService
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function directionsService($rootScope, mapService, markersService) {

    if (!google || !google.maps) {
      console.error('Google Maps API is unavailable.');
    }

    var rawRoute;

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(mapService.getMap());
    directionsDisplay.setOptions({
      suppressMarkers: true//,
      // polylineOptions: {
      //   strokeWeight: 4,
      //   strokeOpacity: 1,
      //   strokeColor:  'red'
      // }
    });

    function calculateAndDisplayRoute(event, marker) {
console.log('calculateAndDisplayRoute', marker.mark.position.lat)

        var waypts = [];
        var selectedMarkers = markersService.getSelectedMarkers();

        for (var i = 0; i < selectedMarkers.length; i++) {
          var marker = selectedMarkers[i];
          waypts.push({
              location: new google.maps.LatLng(marker.mark.position.lat, marker.mark.position.long),
              stopover: true
          });
        }

        if (waypts.length < 2) {
          // directionsDisplay.setMap(null);
          return;
        }
        var directions = {
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.WALKING
        };

        var origin = waypts.shift().location;
        var destination = waypts.pop().location;

        if (origin) {
          directions.origin = origin;
        }

        if (destination) {
          directions.destination = destination;
        }

        if (waypts.length) {
          directions.waypoints = waypts;
        }
        console.log('directions', directions)

        directionsService.route(directions, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              console.log('directions response', response)
                directionsDisplay.setDirections(response);
                rawRoute = response.routes[0];

                // var summaryPanel = document.getElementById('directions-panel');
                // summaryPanel.innerHTML = '';
                // var totalDurationMin = 0;
                // var totalDistanceMiles = 0;

                // For each route, display summary information.
                // for (var i = 0; i < route.legs.length; i++) {
                //     totalDurationMin += route.legs[i].duration.value / 60; // to minutes
                //     totalDistanceMiles += route.legs[i].distance.value / 1000; // to km
                //     var routeSegment = i + 1;
                //     summaryPanel.innerHTML += route.legs[i].duration.text + ': <b>Route Segment: ' + routeSegment + '</b><br>';
                //     summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                //     summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                //     summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                // }

                // totalDurationMin += route.legs[0].duration.value / 60; // to minutes
                // totalDistanceMiles += route.legs[0].distance.value / 1000; // to km
                // for (var i = 0; i < route.legs[0].steps.length; i++) {
                //   console.log('step', step)
                //   var step = route.legs[0].steps[i];
                //   var $step = document.createElement('div');
                //   if (step.maneuver && step.maneuver !== '') {
                //     $step.className = step.maneuver;
                //   }
                //   $step.innerHTML += '<p>' + step.instructions + '<br>' + step.distance.text + ' / ' + step.duration.text + '</p>';
                //   summaryPanel.appendChild($step);
                // }
                // var totals = document.getElementById('totals');
                // totals.innerHTML = '<p>' + (Math.round(totalDistanceMiles * 10) / 10) + 'km / ' + (Math.round(totalDurationMin * 100) / 100) + ' min</p>';
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function cleanRoute() {
      directionsDisplay.setMap(null);
    }

    $rootScope.$on('markersService:toggled-mark', calculateAndDisplayRoute);

    return {
      cleanRoute: cleanRoute,
      calculateAndDisplayRoute: calculateAndDisplayRoute
    };
  }

})();
