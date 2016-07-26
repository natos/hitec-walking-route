angular
  .module('App')
  .service('placesService', [
    '$rootScope',
    'placesModel', 'mapModel',
    'mapService',
    PlacesService
  ]);

/**
 * Places Service Data Service
 *
 * @returns
 * @constructor
 */
function PlacesService($rootScope, placesModel, mapModel, mapService) {

  // Get places information
  (function getPlaces() {
    var service = new google.maps.places.PlacesService(mapService.getMap());
    var places = 0, total = placesModel.places.length;
    for (var i = 0; i < total; i += 1) {
      // Keep reference in the closure
      // while async requests come back
      (function(i) {
        var place = placesModel.places[i];
        var position = i;
        // console.log('Asking for place', place.id, place.label);
        service.getDetails({
          placeId: place.id
        }, function (results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            // console.log('Result OK', place.id, place.label);
            // populate place with place info
            placesModel.places[position].place_info = results;
            placesModel.places[position].place = {
              placeId: results.place_id,
              location: results.geometry.location,
            };
            placesModel.places[position].address = results.formatted_address;
            placesModel.places[position].vicinity = results.vicinity;

            // Categrize Places
            if (placesModel.placesByCategory[placesModel.places[position].category]) {
              placesModel.placesByCategory[placesModel.places[position].category].push(placesModel.places[position]);
            }
          } else {
            console.log('Result Failed', place.id, place.label);
            console.log(results, status);
          }
          // Count loaded place
          if ((places += 1) === (total-1)) {
            $rootScope.$emit(placesModel.events.placesReady);
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

  function getPlaceByOrder(order) {
    var i, t = placesModel.selected.places.length;
    for (i = 0; i < t; i += 1) {
      if (placesModel.selected.places[i].order === order) {
        return placesModel.selected.places[i];
      }
    }
    return false;
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
    var position = placesModel.selected.places.indexOf(place);
    if (position === -1) {
      place.selected = true;
      placesModel.selected.places.push(place);
    }
  }

  function unselectPlace(place) {
    place.selected = false;
    var position = placesModel.selected.places.indexOf(place);
    placesModel.selected.places.splice(position, 1);
  }

  function restart() {
    var total = placesModel.places.length;
    for (var i = 0; i < total; i += 1) {
      placesModel.places[i].selected = false;
    }
  }

  /* delegate */

  $rootScope.$on(mapModel.events.restart, restart);

  /* public */

  return {
    getPlaces: getPlaces,
    getWaypoints: getWaypoints,
    getEndPlace: getEndPlace,
    getStartPlace: getStartPlace,
    getPlaceByOrder: getPlaceByOrder,
    getSelectedPlaces: getSelectedPlaces,
    getPlacesByCategory: getPlacesByCategory,
    selectPlace: selectPlace,
    setStartPlace: setStartPlace,
    setEndPlace: setEndPlace,
    unselectPlace: unselectPlace
  };
}
