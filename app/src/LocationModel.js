(function(){
  'use strict';

  angular
    .module('App')
    .service('locationModel', LocationModel);

    /**
     * Location Model for Hi-Tec Walking Route
     * @constructor
     */
    function LocationModel() {

      /**
       * Location instance
       * @public
       */
      this.currentLocation = null;

      /**
       * Location Model events dictionary
       * @public
       */
      this.events = {
        locationReady: 'locationModel:location-ready',
        locationUnavailable: 'locationModel:location-unavailable'
      };

    }

})();
