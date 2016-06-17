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

    function findPlaceById(id) {
      var total = placesModel.places.length;
      for (var i = 0; i < total; i += 1) {
        if (placesModel.places[i].id === id) {
          return placesModel.places[i];
        }
      }

    }

    function getPlaces() {
      return placesModel.places;
    }

    function getPlacesByCategory() {
      return placesModel.placesByCategory;
    }

    function getSelectedPlaces() {
      return placesModel.selected.places;
    }

    function getWaypoints() {
      var i, w = [];
      for (i = 0; i < placesModel.selected.places.length; i += 1) {
        if (placesModel.selected.places[i].id !== placesModel.selected.start && placesModel.selected.places[i].id !== placesModel.selected.end) {
          w.push(placesModel.selected.places[i]);
        }
      }
      return w;
    }

    function getStartPlace() {
      return findPlaceById(placesModel.selected.start);
    }

    function getEndPlace() {
      return findPlaceById(placesModel.selected.end);
    }

    function setStartPlace(start) {
      placesModel.selected.start = start;
    }

    function setEndPlace(end) {
      placesModel.selected.end = end;
    }

    function selectPlace(place) {
      placesModel.selected.places.push(place);
    }

    function unselectPlace(place) {
      var position = placesModel.selected.places.indexOf(place);
      placesModel.selected.places.splice(position, 1);
    }

    return {
      getPlaces: getPlaces,
      getWaypoints: getWaypoints,
      getEndPlace: getEndPlace,
      getStartPlace: getStartPlace,
      getSelectedPlaces: getSelectedPlaces,
      getPlacesByCategory: getPlacesByCategory,
      selectPlace: selectPlace,
      setStartPlace: setStartPlace,
      setEndPlace: setEndPlace,
      unselectPlace: unselectPlace
    };
  }

})();
