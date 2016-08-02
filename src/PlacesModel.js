angular
  .module('App')
  .service('placesModel', [
    'places',
    PlacesModel
  ]);

  /**
   * Places Controller for Hi-Tec Walking Route
   * @constructor
   */
  function PlacesModel(places) {

    if (!places) {
      console.error('Places information are not available.');
    }

    /**
     * Places Events dictionary
     * @public
     */
    this.events = {
      placeChecked: 'place-checked',
      placesReady: 'places-ready'
    }

    /**
     * Places dictionary
     * @public
     */
    this.places = places;

    /**
    * Places by category
    * @public
    */
    this.placesByCategory = {};

    /**
    * Selected Places
    * @public
    */
    this.selected = {
      places: [],
      start: 0,
      end: 0
    };

  }
