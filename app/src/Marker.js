(function() {
  'use strict';

  angular.module('App')
    .service('Marker', [
      '$rootScope',
      'markersModel',
      'mapService', 'placesService', 'locationService',
      MarkerFactory
    ]);

  /**
   * Marker factory
   */
  function MarkerFactory($rootScope, markersModel, mapService, placesService, locationService) {

    /**
     * Marker contructor
     * @constructor
     */

    function Marker(place, icon) {

      var marker = this;

      var raw = {
        place: place.place,
        icon: markerIcon(icon||{})
      };

      this.pin = new google.maps.Marker(raw);
      this.place = place;
      this.place.selected && this.select();

      google.maps.event.addListener(this.pin, 'click', function() {
        marker.toggle.call(marker);
      });

      return this;
    };

    Marker.prototype.toggle = function() {
      if (this.place.selected) {
        this.unselect();
      } else {
        this.select();
      }
      return this;
    };

    Marker.prototype.order = function(order) {
      if (!order) {
        return this.place.order;
      }
      this.place.order = order;
      this.pin.setLabel({
        color: '#ffffff',
        text: '' + order
      });
      return this;
    };

    Marker.prototype.select = function() {
      var icon = markerIcon({
        scale: .75,
        path: markersModel.iconPath.selectedPin,
        fillColor: '#037AFF' // this.place.color
      });
      this.pin.setIcon(icon);
      this.place.selected = true;
      return this;
    };

    Marker.prototype.unselect = function() {
      var icon = markerIcon();
      this.pin.setIcon(icon);
      this.place.selected = false;
      return this;
    };

    Marker.prototype.isSelected = function() {
      return this.place.selected;
    };

    Marker.prototype.render = function(map) {
      this.pin.setMap(map);
      return this;
    };

    Marker.prototype.drop = function(map) {
      this.pin.setAnimation(google.maps.Animation.DROP);
      this.render(map);
      return this;
    };

    Marker.prototype.remove = function() {
      this.pin.setMap(null);
      return this;
    }

    // construct a marker icon
    function markerIcon(options) {
      var options = options || {};
      var icon = {
        path: options.path || markersModel.iconPath.unselectedPin,
        scale: options.scale || markersModel.iconDefaults.scale,
        strokeWeight: options.strokeWeight || markersModel.iconDefaults.strokeWeight,
        fillColor: options.fillColor || markersModel.iconDefaults.fillColor,
        fillOpacity: options.fillOpacity || markersModel.iconDefaults.fillOpacity,
        labelOrigin: options.labelOrigin || markersModel.iconDefaults.labelOrigin
      };
      return icon;
    }

    return Marker;
  };

})();
