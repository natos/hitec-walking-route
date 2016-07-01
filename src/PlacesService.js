angular
  .module('App')
  .service('placesService', [
    '$rootScope', 'placesModel', 'directionsModel', 'mapService',
    PlacesService
  ]);

/**
 * Places Service Data Service
 *
 * @returns
 * @constructor
 */
function PlacesService($rootScope, placesModel, directionsModel, mapService) {

  // Get places information
  (function getPlaces() {
    var service = new google.maps.places.PlacesService(mapService.getMap());
    var places = 0, total = placesModel.places.length;
    function placeLoaded() {
      places += 1;
      if (places === (total-1)) $rootScope.$emit(placesModel.events.placesReady);
    }
    for (var i = 0; i < total; i += 1) {
      // Keep reference in the closure
      // while async requests come back
      (function(i) {
        var place = placesModel.places[i];
        var position = i;
        service.getDetails({
          placeId: place.id
        }, function (results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            // populate place with place info
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

            placeLoaded();
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
    w.sort(sortByOrder);
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
    var position = placesModel.selected.places.indexOf(place);
    if (position === -1) {
      placesModel.selected.places.push(place);
    }
  }

  function unselectPlace(place) {
    var position = placesModel.selected.places.indexOf(place);
    placesModel.selected.places.splice(position, 1);
  }

  function sortSelectedPlacesByOrder() {
    console.log('sorting places by selected', placesModel.selected.places);
    $rootScope.selected.places = placesModel.selected.places.sort(sortByOrder);
    // apply state change
    if (!$rootScope.$$phase) $rootScope.$apply();
    //
    // for (var i = 0; i < placesModel.selected.places.length; i += 1) {
    //   if(!placesModel.selected.places[i].order) {
    //     console.log('no order?')
    //   } else {
    //     console.log('order', placesModel.selected.places[i].order)
    //   }
    //   console.log(i, 'new order for', placesModel.selected.places[i].label, placesModel.selected.places[i].order, placesModel.selected.places[i]);
    // }
  }

  function sortByOrder(a, b) {
    return a.order - b.order;
  }

  /* delegate */

  // $rootScope.$on(directionsModel.events.displayedDirections, sortSelectedPlacesByOrder);

  /* public */

  return {
    getPlaces: getPlaces,
    getWaypoints: getWaypoints,
    getEndPlace: getEndPlace,
    getStartPlace: getStartPlace,
    getSelectedPlaces: getSelectedPlaces,
    getPlacesByCategory: getPlacesByCategory,
    sortSelectedPlacesByOrder: sortSelectedPlacesByOrder,
    selectPlace: selectPlace,
    setStartPlace: setStartPlace,
    setEndPlace: setEndPlace,
    unselectPlace: unselectPlace
  };
}
