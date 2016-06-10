(function() {
  'use strict';

  angular
    .module('App')
    .service('placesService', [
      '$rootScope', 'placesModel', 'mapService',
      PlacesService
    ]);

  /**
   * Places Service Data Service
   *
   * @returns
   * @constructor
   */
  function PlacesService($rootScope, placesModel, mapService) {

    // Get places information
    (function getPlaces() {
      var service = new google.maps.places.PlacesService(mapService.getMap());
      var places = 0, total = placesModel.places.length;
      function loaded() {
        places += 1;
        if (places === total) $rootScope.$emit(placesModel.events.placesReady);
      }
      for (var i = 0; i < total; i += 1) {
        // Keep reference in the closure
        // while async requests come back
        (function(i) {
          var mark = placesModel.places[i];
          var position = i;
          service.getDetails({
            placeId: mark.location.place_id
          }, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              // populate mark with place info
              placesModel.places[position].place_info = results;
              placesModel.places[position].place = {
                placeId: results.place_id,
                location: results.geometry.location,
              };
              placesModel.places[position].address = results.formatted_address;
              placesModel.places[position].vicinity = results.vicinity;

              if (placesModel.placesByCategory[placesModel.places[position].category]) {
                placesModel.placesByCategory[placesModel.places[position].category].push(placesModel.places[position]);
              }

              loaded();
            }
          });
        })(i);
      }
    })();

    function getPlaces() {
      return placesModel.places;
    }

    function getPlacesByCategory() {
      return placesModel.placesByCategory;
    }

    function getSelectedPlaces() {
      return placesModel.selectedPlaces;
    }

    function selectPlace(place) {
      placesModel.selectedPlaces.push(place);
    }

    return {
      getPlaces: getPlaces,
      getPlacesByCategory: getPlacesByCategory,
      getSelectedPlaces: getSelectedPlaces
    };
  }

})();
