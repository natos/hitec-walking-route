angular
  .module('App')
  .service('markersModel', MarkersModel);

  /**
   * Marker Model for Hi-Tec Walking Route
   * @constructor
   */
  function MarkersModel() {

    /**
     * Map Model map instance
     * @public
     */
    // this.map = null;

    /**
     * Map Model events dictionary
     * @public
     */
    this.events = {
      markersUpdated: 'markers:updated',
      markersCleaned: 'markers:cleaned'
    };

    /**
     * Marker Model SVG Path dictionary
     * @public
     */
    this.iconPath = {
      selectedPin: "M0-50A17.38 17.38 0 0 0-17.5-32.5C-17.5-19.51 0 0 0 0S17.5-19.51 17.5-32.5A17.38 17.38 0 0 0 0-50Z",
      unselectedPin: "M0-50A17.38 17.38 0 0 0-17.5-32.5C-17.5-19.51 0 0 0 0S17.5-19.51 17.5-32.5A17.38 17.38 0 0 0 0-50ZM0-25a7.28 7.28 0 0 1-7.28-7.28A7.28 7.28 0 0 1 0-39.55a7.28 7.28 0 0 1 7.28 7.28A7.28 7.28 0 0 1 0-25Z",
      yourLocation: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
    }

    /**
     * Marker Model icon defaults
     * @public
     */
    this.iconDefaults = {
      scale: .5,
      strokeWeight: 0,
      fillColor: "#666666",
      fillOpacity: .85,
      labelOrigin: new google.maps.Point(-2, -30)
    };

    /**
     * Marker Model Markers Collection
     * @public
     */
    this.markers = [];

    /**
     * Marker Model Selected Markers Collection
     * @public
     */
    this.selectedMarkers = [];


    /**
     * Flag to know if your location was already render
     * @public
     */
    this.yourPin = false;
  }
