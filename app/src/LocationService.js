(function() {
  'use strict';

  angular.module('App')
    .service('locationService', [
      '$rootScope',
      'locationModel',
      LocationService
    ]);

  /**
   * Location Service
   * @constructor
   */
  function LocationService($rootScope, locationModel) {

    // try to get the current location from device API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        locationModel.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        $rootScope.$emit(locationModel.events.locationReady);
      });
    } else {
      /* geolocation IS NOT available */
      $rootScope.$emit(locationModel.events.locationUnavailable);
    }

    function getCurrentLocation() {
      return locationModel.currentLocation;
    }

    // public interface
    return {
      getCurrentLocation: getCurrentLocation
    };
  }

})();
