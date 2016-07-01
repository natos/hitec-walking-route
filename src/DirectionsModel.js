angular
  .module('App')
  .service('directionsModel', DirectionsModel);

  /**
   * Directions Model for Hi-Tec Walking Route
   * @constructor
   */
  function DirectionsModel() {

    /**
     * Directions Model route information
     * @public
     */
    this.route = null;

    /**
     * Directions Model duration information
     * @public
     */
    this.duration = { value: 0, min: 0 };

    /**
     * Directions Model distance information
     * @public
     */
    this.distance = { value: 0, min: 0 };

    /**
     * Directions Model events dictionary
     * @public
     */
    this.events = {
      calculatingDirections: 'directions:calculating-directions',
      calculatingDirectionsEnd: 'directions:calculating-directions-end',
      gettingDirections: 'directions:getting-directions',
      displayingDirections: 'directions:displaying-directions',
      displayedDirections: 'directions:displayed-directions',
      displayingdDirectionsError: 'directions:displaying-directions-error'
    };

    /**
     * direcctions Model config dictionary
     * @public
     */
    this.options = {
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: {
        strokeWeight: 5,
        strokeOpacity: .75,
        strokeColor: "#CC0000"
      }
    };

  }
