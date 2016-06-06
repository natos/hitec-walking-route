(function() {
  'use strict';

  angular.module('map')
    .service('mapService', [
      '$rootScope', '$window',
      MapService
    ]);

  /**
   * Users DataService
   * Uses embedded, hard-coded data model; acts asynchronously to simulate
   * remote data service call(s).
   *
   * @returns {{loadAll: Function}}
   * @constructor
   */
  function MapService($rootScope, $window) {

    var styles = [{
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "landscape.natural",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#f5f5f2"
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "administrative",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.attraction",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#ff0000"
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "poi.business",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.medical",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.place_of_worship",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.school",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.sports_complex",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{
        "color": "#ffffff"
      }, {
        "visibility": "simplified"
      }]
    }, {
      "featureType": "road.arterial",
      "stylers": [{
        "visibility": "simplified"
      }, {
        "color": "#ffffff"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [{
        "color": "#ffffff"
      }, {
        "visibility": "off"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.arterial",
      "stylers": [{
        "color": "#ffffff"
      }]
    }, {
      "featureType": "road.local",
      "stylers": [{
        "color": "#ffffff"
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "water",
      "stylers": [{
        "color": "#71c8d4"
      }]
    }, {
      "featureType": "landscape",
      "stylers": [{
        "color": "#e5e8e7"
      }]
    }, {
      "featureType": "poi.park",
      "stylers": [{
        "color": "#8ba129"
      }]
    }, {
      "featureType": "road",
      "stylers": [{
        "color": "#ffffff"
      }]
    }, {
      "featureType": "poi.sports_complex",
      "elementType": "geometry",
      "stylers": [{
        "color": "#c7c7c7"
      }, {
        "visibility": "off"
      }]
    }, {
      "featureType": "water",
      "stylers": [{
        "color": "#a0d3d3"
      }]
    }, {
      "featureType": "poi.park",
      "stylers": [{
        "color": "#91b65d"
      }]
    }, {
      "featureType": "poi.park",
      "stylers": [{
        "gamma": 1.51
      }]
    }, {
      "featureType": "road.local",
      "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [{
        "visibility": "on"
      }]
    }, {
      "featureType": "poi.government",
      "elementType": "geometry",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "landscape",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        { "color": "#666666" },{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [{
        "visibility": "simplified"
      }]
    }, {
      "featureType": "road.local",
      "stylers": [{
        "visibility": "simplified"
      }]
    }, {
      "featureType": "road"
    }, {
      "featureType": "road"
    }, {}, {
      "featureType": "road.highway"
    }];

    var AmsterdamMark = {
      lat: 52.370216,
      lng: 4.895168
    };

    var HiTecStoreMark = {
      lat: 52.3620861,
      lng: 4.8824255
    };

    var currentLocation;

    var map;

    var config = {
      zoom: 14,
      center: AmsterdamMark,
      disableDefaultUI: true,
      scaleControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE
      }
    };

    // try to get the current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        $rootScope.$emit('mapService:location-ready');
      });
    } else {
      /* geolocation IS NOT available */
      $rootScope.$emit('mapService:location-ready');
    }

    function centerMap() {
      var map = getMap();
      map.setCenter(currentLocation || config.center);
      map.setZoom(config.zoom);
      return map;
    }

    function getMap() {
      if (map) { return map; }
      map = new google.maps.Map(document.getElementById('map'), config);
      map.setOptions({ "styles": styles });
      return map;
    }

    function getReady() {
      google.maps.event.trigger(map, 'resize');
      centerMap();
    }

    function getCurrentLocation() {
      return currentLocation;
    }

    // delegate
    $rootScope.$on('mapController:center-map', centerMap);
    $rootScope.$on('markersService:cleaned-markers', centerMap);

    angular.element($window).bind('resize', getReady);


    // public interface
    return {
      getMap: getMap,
      centerMap: centerMap,
      getReady: getReady,
      getCurrentLocation: getCurrentLocation
    };
  }

})();
