angular
  .module('App')
  .service('mapModel', MapModel);

  /**
   * Map Model for Hi-Tec Walking Route
   * @constructor
   */
  function MapModel() {

    /**
     * Map Model Google Maps API Key
     * @public
     */
    this.API_KEY = 'AIzaSyCcara1t7Tt4Y6iexHJvLGBo_zfW4O6eQo';

    /**
     * Map Model map instance
     * @public
     */
    this.map = null;

    /**
     * Map Model events dictionary
     * @public
     */
    this.events = {

    };

    /**
     * Map styles dictionary
     * @private
     */

    this.styles = [{
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

    /**
     * Map Model Amsterdam Mark
     * @private
     */
    var AmsterdamMark = {
      lat: 52.370216,
      lng: 4.895168
    };

    /**
     * Map Model Hi-Tec Store Mark
     * @public
     */
    var HiTecStoreMark = {
      lat: 52.3620861,
      lng: 4.8824255
    };

    /**
     * Map Model config dictionary
     * @public
     */
    this.config = {
      zoom: 14,
      center: AmsterdamMark,
      disableDefaultUI: true,
      scaleControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE
      }
    };

  }
