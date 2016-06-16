(function() {
  'use strict';

  angular.module('App')
    .service('markersService', [
      '$rootScope', '$timeout',
      'appModel', 'markersModel',
      'mapService', 'placesService', 'locationService',
      'Marker',
      MarkersService
    ]);

  /**
   * Markers DataService
   *
   * @returns {{getMarkers: Function}}
   * @constructor
   */
  function MarkersService($rootScope, $timeout, appModel, markersModel, mapService, placesService, locationService, Marker) {
    //
    // // construct a marker icon
    // function markerIcon(options) {
    //   var icon = {
    //     path: options.path,
    //     scale: options.scale || .75,
    //     strokeWeight: options.strokeWeight || 0,
    //     fillColor: options.fillColor || "#ffffff",
    //     fillOpacity: options.fillOpacity || .85,
    //     labelOrigin: new google.maps.Point(-2, -30)
    //   };
    //   return icon;
    // }
    //
    // // select marker
    // function selectMarker(marker) {
    //   if (!isMarkSelected(marker.mark)) {
    //     var order = markersModel.selectedMarkers.push(marker);
    //     marker.mark.order = order;
    //     marker.mark.selected = true;
    //     selectMarkerPin(marker);
    //     // TODO: Emit an event to notify that Marker has been selected
    //     $rootScope.$emit('markersService:marker-selected', marker);
    //   }
    // }
    //
    // function unselectMarker(marker) {
    //   var position = markersModel.selectedMarkers.indexOf(marker);
    //   markersModel.selectedMarkers.splice(position, 1);
    //   marker.mark.selected = false;
    //   unselectMarkerPin(marker);
    //   // TODO: Emit an event to notify that Marker has been unselected
    //   $rootScope.$emit('markersService:marker-unselected', marker);
    // }
    //
    // // set selected icon on a marker
    // function selectMarkerPin(marker) {
    //   var icon = markerIcon({
    //     path: markersModel.iconPath.selectedPin,
    //     fillColor: marker.mark.color,
    //     fillOpacity: 1
    //   });
    //   marker.setIcon(icon);
    //   marker.mark.selected = true;
    // }
    //
    // // set unselected icon on a marker
    // function unselectMarkerPin(marker) {
    //   var icon = markerIcon({
    //     path: markersModel.iconPath.unselectedPin,
    //     fillColor:  "#666666"
    //   });
    //   marker.setIcon(icon);
    //   marker.mark.selected = false;
    // }

    // return true if the mark is selected
    function isMarkerSelected(marker) {
      return isMarkSelected(marker.mark);
    }

    // return true if the mark is selected
    function isMarkSelected(mark) {
      var selectedPlaces = placesService.getSelectedPlaces();
      for (var i = 0; i < selectedPlaces.length; i += 1) {
        if (selectedPlaces[i].id === mark.id) {
          return true;
        }
      }
      return false;
    }

    // finds a specific marker given a place
    function getMarker(place) {
      for (var i = 0; i < markersModel.markers.length; i += 1) {
        if (markersModel.markers[i].place.id === place.id) {
          return markersModel.markers[i];
        }
      }
    }
    //
    // // creates a marker in the map
    // function createMarker(mark, i, t) {
    //   var marker = getMarker(mark);
    //   if (!marker) {
    //     var raw = {
    //       mark: mark,
    //       place: mark.place//,
    //       // animation: google.maps.Animation.DROP,
    //       // icon: markerIcon({ fillColor: mark.color })
    //     }
    //     marker = new google.maps.Marker(raw);
    //     marker.addListener('click', toggleMarker);
    //     markersModel.markers.push(marker);
    //     // $timeout(function() {
    //       marker.setMap(mapService.getMap());
    //       areAllMarkersDropped(i, t);
    //     // }, dropMarkTiming(i));
    //   } else {
    //     marker.setAnimation(null);
    //     marker.setMap(mapService.getMap());
    //   }
    //   // make sure to toggle the pin
    //   if (marker.mark.selected) {
    //     selectMarkerPin(marker);
    //   } else {
    //     unselectMarkerPin(marker);
    //   }
    //   // console.log('new marker', marker)
    // }

    // timer function to drop markers
    // function dropMarkTiming(i) {
    //   return (i + .75) * 350;
    // }

    // // toggle a map marker
    // function toggleMarker() {
    //   // reset pin label
    //   this.setLabel('');
    //   if (isMarkerSelected(this)) {
    //     unselectMarker(this);
    //   } else {
    //     selectMarker(this);
    //   }
    //   reorderMarkers();
    //
    //   $rootScope.$emit('markersService:toggled-mark', this);
    //   if (!$rootScope.$$phase) $rootScope.$apply();
    // }

    // reorder markers numbers
    function reorderMarkers() {
      for (var i = 0; i < markersModel.selectedMarkers.length; i += 1) {
        markersModel.selectedMarkers[i].mark.order = i + 1;
        markersModel.selectedMarkers[i].setLabel({
          color: '#ffffff',
          text: '' + (i + 1)
        });
      }
    }

    function reorderMarkersFromRoute(route) {
      console.log('reorderMarkersFromRoute',route);
      console.log('markersModel.selectedMarkers',markersModel.selectedMarkers);

      var waypoints = placesService.getWaypoints();

      var startPlace = getMarker(placesService.getStartPlace());
      if (startPlace) {
        startPlace.order(1);
      }

      var endPlace = getMarker(placesService.getEndPlace());
      if (endPlace) {
        endPlace.order(waypoints.length + 2);
      }

      for (var i = 0; i < waypoints.length; i += 1) {
        var marker = getMarker(waypoints[i]);
        console.log('marker', marker, route.waypoint_order[i] + 2);
        if (marker) {
          marker.order(route.waypoint_order[i] + 2);
        }
      }

    }

    var drops = 0;
    function areAllMarkersDropped(i, t) {
      drops += 1;
      if (drops === t) {
        $rootScope.$emit('markersService:dropped-pins');
      }
    }

    function createMarkers() {
      var places = placesService.getPlaces();
      for (var i = 0; i < places.length; i += 1) {
        var marker = new Marker(places[i]).render(mapService.getMap());
        markersModel.markers.push(marker);
      }
      // console.log('Created Markers', markersModel.markers);
    }

    // create a collection of markers
    function dropMarkers(m) {
      var m = m || placesService.getPlaces();
      var t = m.length;
      for (var i = 0; i < t; i += 1) {
        createMarker(m[i], i, t);
      }
    }

    function dropYourLocationPin() {
      var location = locationService.getCurrentLocation();
      if (!location) return;
      var raw = {
        map: mapService.getMap(),
        position: location,
        icon: {
          path: markersModel.iconPath.yourLocation,
          scale: 1,
          strokeWeight: 0,
          fillColor: '#037AFF',
          fillOpacity: 1
        }
      }
      new google.maps.Marker(raw);
    }

    function cleanUnselectedMarkers() {
      for (var i = 0; i < markers.length; i += 1) {
        if (!markers[i].mark.selected) {
          clearMarker(markers[i])
        }
      }
    }

    function recoverMarkers() {
      clearMarkers();
      $timeout(function () {
        dropMarkers();
      });
    }

    // remove marker from the map
    function clearMarker(marker) {
      if (typeof marker.mark === 'undefined') {
        marker = getMarker(marker);
      }
      marker.setMap(null);
    }
    // remove markers from the map
    function clearMarkers() {
      for (var i = 0; i < markers.length; i += 1) {
        clearMarker(markers[i]);
      }
    }

    // unselect markers
    function cleanMarkers() {
      for (var i = 0; i < selectedMarkers.length; i += 1) {
        selectedMarkers[i].setLabel('');
        unselectMarkerPin(selectedMarkers[i], i);
      }
      selectedMarkers.splice(0, selectedMarkers.length);
      $rootScope.$emit('markersService:cleaned-markers');
    }

    // clean filtered markers
    // function cleanFilteredMarkers() {
    //   filteredMarkers.splice(0, filteredMarkers.length);
    // }

    // filter by categories
    // function filterByCategories() {
    //   cleanFilteredMarkers();
    //   isFiltering = false;
    //   var categories = categoriesService.getSelectedCategories();
    //   if (categories.length) {
    //     for (var i = 0; i < marks.length; i += 1) {
    //       var isMarkerSelected = isMarkSelected(marks[i])
    //       var categoryIsSelected = categories.indexOf(marks[i].category) > -1;
    //       var categoryIsUndefined = typeof marks[i].category === 'undefined';
    //       if (isMarkerSelected || categoryIsSelected || categoryIsUndefined) {
    //         filteredMarkers.push(marks[i]);
    //       }
    //     }
    //   }
    //   if (filteredMarkers.length) {
    //     isFiltering = true;
    //     clearMarkers();
    //     $timeout(function () {
    //       dropMarkers(filteredMarkers);
    //     });
    //   }
    //   $rootScope.$emit('markersService:filtered-by-categories');
    // }

    function restartMarkers() {
      // isFiltering = false;
      cleanMarkers();
      // cleanFilteredMarkers();
      $timeout(function () {
        dropMarkers();
      });
    }

    // function getMarkerByLocation(location) {
    //   for (var i = 0; i < selectedMarkers.length; i += 1) {
    //     if (selectedMarkers[i].mark.address.indexOf(location) >= 0 || location.indexOf(selectedMarkers[i].mark.address) >= 0) {
    //       return angular.extend({}, selectedMarkers[i]);
    //     }
    //   }
    //   return false;
    // }

    // delegate
    $rootScope.$on('mapController:restart-map', restartMarkers);
    $rootScope.$on('mapController:set-print-mode', cleanUnselectedMarkers);
    $rootScope.$on('mapController:unset-print-mode', recoverMarkers);
    // $rootScope.$on('categoriesService:updated', filterByCategories);


    // public interface
    return {
      dropMarkers: dropMarkers,
      createMarkers: createMarkers,
      dropYourLocationPin: dropYourLocationPin,
      reorderMarkersFromRoute: reorderMarkersFromRoute,
      // getMark: function(i) {
      //   return marks[i];
      // },
      // getMarks: function() {
      //   return marks;
      // },
      // getMarker: function(i) {
      //   return markers[i];
      // },
      // getMarkers: function() {
      //   return markers;
      // },
      // getSelectedMarkers: function() {
      //   return selectedMarkers;
      // },
      // getPlaces: getPlaces,
      // getMarkerByLocation: getMarkerByLocation
    };
  }

})();
