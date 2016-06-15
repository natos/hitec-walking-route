(function() {
  'use strict';

  angular.module('App')
    .service('markersService', [
      '$rootScope', '$timeout',
      'markersModel',
      'mapService', 'placesService', 'locationService',
      MarkersService
    ]);

  /**
   * Markers DataService
   *
   * @returns {{getMarkers: Function}}
   * @constructor
   */
  function MarkersService($rootScope, $timeout, markersModel, mapService, placesService, locationService) {

    // collections of markers in the map
    var markers = [];
    // collection of selected markers
    var selectedMarkers = [];
    // collections of filtered markers
    // var filteredMarkers = [];
    // filtering flag
    // var isFiltering = false;

    var yourLocationSVGPath = "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z";
    // SVG for unselected pins
    var pinSVGPath = "M0-50A17.38 17.38 0 0 0-17.5-32.5C-17.5-19.51 0 0 0 0S17.5-19.51 17.5-32.5A17.38 17.38 0 0 0 0-50Z";
    // SVG for selected pins
    var pinCircleSVGPath = "M0-50A17.38 17.38 0 0 0-17.5-32.5C-17.5-19.51 0 0 0 0S17.5-19.51 17.5-32.5A17.38 17.38 0 0 0 0-50ZM0-25a7.28 7.28 0 0 1-7.28-7.28A7.28 7.28 0 0 1 0-39.55a7.28 7.28 0 0 1 7.28 7.28A7.28 7.28 0 0 1 0-25Z";

    // construct a marker icon
    function markerIcon(options) {
      var icon = {
        path: options.path,
        scale: options.scale || .75,
        strokeWeight: options.strokeWeight || 0,
        fillColor: options.fillColor || "#ffffff",
        fillOpacity: options.fillOpacity || .85,
        labelOrigin: new google.maps.Point(-2, -30)
      };
      // console.log('set icon', icon);
      return icon;
    }

    // set selected icon on a marker
    function selectMarkerPin(marker) {
      marker.setIcon(markerIcon({
        path: pinSVGPath,
        fillColor: marker.mark.color,
        fillOpacity: 1
      }));
      marker.mark.selected = true;
    }

    // set unselected icon on a marker
    function unselectMarkerPin(marker) {
      marker.setIcon(markerIcon({
        path: pinCircleSVGPath,
        fillColor:  "#aaaaaa"//marker.mark.color
      }));
      marker.mark.selected = false;
    }

    // return true if the mark is selected
    function isMarkSelected(mark) {
      for (var i = 0; i < selectedMarkers.length; i += 1) {
        if (selectedMarkers[i].mark === mark) {
          return true;
        }
      }
      return false;
    }

    // finds a specific marker given a mark
    function getMarker(mark) {
      for (var i = 0; i < markers.length; i += 1) {
        if (markers[i].mark.id === mark.id) {
          return markers[i];
        }
      }
    }

    // creates a marker in the map
    function createMarker(mark, i, t) {
      var marker = getMarker(mark);
      if (!marker) {
        var raw = {
          mark: mark,
          place: mark.place//,
          // animation: google.maps.Animation.DROP,
          // icon: markerIcon({ fillColor: mark.color })
        }
        marker = new google.maps.Marker(raw);
        marker.addListener('click', toggleMarker);
        markers.push(marker);
        // $timeout(function() {
          marker.setMap(mapService.getMap());
          areAllMarkersDropped(i, t);
        // }, dropMarkTiming(i));
      } else {
        marker.setAnimation(null);
        marker.setMap(mapService.getMap());
      }
      // make sure to toggle the pin
      if (marker.mark.selected) {
        selectMarkerPin(marker);
      } else {
        unselectMarkerPin(marker);
      }
      // console.log('new marker', marker)
    }

    // timer function to drop markers
    function dropMarkTiming(i) {
      return (i + .75) * 350;
    }

    // toggle a map marker
    function toggleMarker() {
      // reset pin label
      this.setLabel('');
      var position = selectedMarkers.indexOf(this);
      var isAlreadySelected = position >= 0;
      if (isAlreadySelected) {
        selectedMarkers.splice(position, 1);
        // this.mark.selected = false;
        unselectMarkerPin(this);
      } else {
        var order = selectedMarkers.push(this);
        this.mark.order = order;
        // this.mark.selected = true;
        selectMarkerPin(this);
      }

      reorderMarkers();
      // if (isFiltering) filterByCategories();

      $rootScope.$emit('markersService:toggled-mark', this);
      if (!$rootScope.$$phase) $rootScope.$apply();
    }

    // reorder markers numbers
    function reorderMarkers() {
      for (var i = 0; i < selectedMarkers.length; i += 1) {
        selectedMarkers[i].mark.order = i + 1;
        selectedMarkers[i].setLabel({
          color: '#ffffff',
          text: ''+(i+1)
        });
      }
    }

    function reorderMarkersFromRoute(route) {
      console.log('reorderMarkersFromRoute',route);
      for (var i = 0; i < route.waypoint_order; i += 1) {
        // TODO: reorder optimized waypoints
      }
    }

    var drops = 0;
    function areAllMarkersDropped(i, t) {
      drops += 1;
      if (drops === t) {
        $rootScope.$emit('markersService:dropped-pins');
        reorderMarkers();
      }
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
      var raw = {
        map: mapService.getMap(),
        position: locationService.getCurrentLocation(),
        // animation: google.maps.Animation.BOUNCE,
        icon: {
          path: yourLocationSVGPath,
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
      isFiltering = false;
      cleanMarkers();
      cleanFilteredMarkers();
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
