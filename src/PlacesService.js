angular
  .module('App')
  .service('placesService', [
    '$rootScope', '$timeout',
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
function PlacesService($rootScope, $timeout, placesModel, mapModel, mapService) {

  /** autorun */
  // Order places into categories and get extra info for all places
  var places = 0, loadedplaces = 0, categories = [], categorization = {}, totalplaces = placesModel.places.length;
  // get all categories
  for (var i = 0; i < totalplaces; i += 1) {
    var place = placesModel.places[i];
    getPlaceInfo(place.id);
    categories.push(place.category);
    if (!categorization[place.category]) {
      categorization[place.category] = [];
    }
    categorization[place.category].push(place);
  }
  // order categories alphabetically
  categories.sort();
  for (var c = 0; c < categories.length; c += 1) {
    var category = categories[c];
    // store categorized places into the model
    placesModel.placesByCategory[category] = categorization[category];
  }
  // cleaning
  categories.length = 0;
  categories = null;
  categorization = null;
  /** end autorun */

  var _service = new google.maps.places.PlacesService(mapService.getMap());

  function getPlaceInfo(id) {

    var place = findPlaceById(id);
    if (!place) {
      return console.error('Place Id not found', id);
    }

    var timing = Math.floor(Math.random() * (15000 - 1500)) + 1500;

    $timeout(function() {
      _service.getDetails({
        placeId: place.id
      }, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          place.place_info = results;
          place.address = results.formatted_address;
          place.vicinity = results.vicinity;
          place.place = {
            placeId: results.place_id,
            location: results.geometry.location
          };
          place.loaded = true;
        } else {
          console.error('Google Places API', 'Result Failed for', place.label, place.id, status, 'Re-trying');
          getPlaceInfo(place.id);
        }
        loadedplaces += 1;
        if (loadedplaces === totalplaces) {
          $rootScope.$emit(placesModel.events.placesReady);
        }
      });
    }, timing);
  }


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
      // placesModel.places[i].selected = false;
      unselectPlace(placesModel.places[i]);
    }
  }

  /* delegate */

  $rootScope.$on(mapModel.events.restart, restart);

  /* public */

  return {
    getPlaces: getPlaces,
    getPlaceInfo: getPlaceInfo,
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
