(function() {
  'use strict';

  angular.module('map')
    .service('markersService', [
      '$rootScope', '$timeout', 'mapService', 'categoriesService',
      MarkersService
    ]);

  /**
   * Markers DataService
   *
   * @returns {{getMarkers: Function}}
   * @constructor
   */
  function MarkersService($rootScope, $timeout, mapService, categoriesService) {

    // collections of markers in the map
    var markers = [];
    // collection of selected markers
    var selectedMarkers = [];
    // collections of filtered markers
    var filteredMarkers = [];
    // filtering flag
    var isFiltering = false;

    // collection of raw marks
    var marks = [
      {
        id: 1,
        color: "#1D8800",
        label: "Anne Frank Huis",
        category: "Typical Amsterdam",
        content: [
          "Iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla. Option congue nihil imperdiet doming id quod mazim placerat facer possim.",
          "Minim veniam quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea! Facilisi nam liber tempor cum soluta nobis eleifend assum typi non habent claritatem insitam est.",
          "Ea commodo consequat duis autem vel eum iriure dolor in hendrerit? Litterarum formas humanitatis per seacula quarta decima et quinta decima eodem modo typi."
        ],
        author: {
          name: "Shannon Banks",
          role: "Fashion designer",
          picture: "/app/assets/img/avatars/ShannonBanks.jpg"
        },
        media: {
          x1: '/app/assets/img/x1/annefrank.jpg',
          x2: '/app/assets/img/x2/annefrank.jpg',
          x3: '/app/assets/img/x3/annefrank.jpg'
        },
        location: {
          place_id: "ChIJSRE-IcUJxkcRCltjPmVdmtQ"
        }
      },
      {
        id: 2,
        color: "#2688FF",
        label: "Hi-Tec Store",
        website: "http://www.hi-tec.amsterdam",
        content: [
          "Dolore te feugait nulla facilisi nam liber tempor cum, soluta nobis eleifend option. Facit eorum claritatem Investigationes demonstraverunt lectores legere me lius quod.",
          "Putamus parum claram anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Legentis in iis: qui ii legunt saepius claritas. Luptatum zzril delenit augue duis congue nihil imperdiet doming.",
          "Sequitur mutationem consuetudium lectorum mirum est notare quam littera gothica quam nunc? Qui eodem modo; typi qui nunc nobis videntur parum clari fiant sollemnes in?"
        ],
        author: {
          name: "Andrea Clarke",
          role: "Entrepreneur",
          picture: "/app/assets/img/avatars/AndreaClarke.jpg"
        },
        media: {
          x1: '/app/assets/img/x1/hitecstore.jpg',
          x2: '/app/assets/img/x2/hitecstore.jpg',
          x3: '/app/assets/img/x3/hitecstore.jpg'
        },
        location: {
          place_id: "ChIJIyPEUu8JxkcRTmRcuMxC9yc"
        }
      },
      {
        id: 3,
        color: "#7F007F",
        label: "Vondelpark",
        category: "Typical Amsterdam",
        content: [
          "Illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui! Consuetudium lectorum mirum est notare quam littera gothica quam nunc putamus parum claram anteposuerit.",
          "Erat volutpat ut wisi enim ad minim veniam quis nostrud exerci. Zzril delenit augue duis dolore te feugait nulla facilisi nam liber tempor cum soluta nobis.",
          "Eodem modo typi qui nunc nobis videntur parum clari fiant sollemnes in."
        ],
        author: {
          name: "Marie Bennett",
          role: "Architect",
          picture: "/app/assets/img/avatars/MarieBennett.jpg"
        },
        media: {
          x1: '/app/assets/img/x1/vondelpark.jpg',
          x2: '/app/assets/img/x2/vondelpark.jpg',
          x3: '/app/assets/img/x3/vondelpark.jpg'
        },
        location: {
          place_id: "ChIJz3y0xeIJxkcRNcogBVV41Gw"
        }
      },
      {
        id: 4,
        color: "#E37F00",
        label: "Bloemenmarkt",
        category: "Markets",
        content: [
          "Esse molestie consequat vel illum dolore eu feugiat. Modo typi qui nunc nobis videntur parum clari fiant sollemnes in. Ut laoreet dolore magna aliquam erat volutpat ut wisi enim. Per seacula quarta decima et quinta decima eodem. In iis qui facit eorum, claritatem Investigationes demonstraverunt lectores legere me. Eleifend option congue nihil imperdiet doming id quod mazim.",
          "Eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue.",
          "Id quod mazim placerat facer, possim assum typi non habent claritatem insitam est usus legentis in. Consectetuer adipiscing elit sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat! Te feugait nulla facilisi nam liber tempor cum soluta. Consequat duis autem vel eum iriure dolor in hendrerit in vulputate velit."
        ],
        author: {
          name: "Marie Bennett",
          role: "Architect",
          picture: "/app/assets/img/avatars/MarieBennett.jpg"
        },
        media: {
          x1: '/app/assets/img/x1/bloemenmarkt.jpg',
          x2: '/app/assets/img/x2/bloemenmarkt.jpg',
          x3: '/app/assets/img/x3/bloemenmarkt.jpg'
        },
        location: {
          place_id: "ChIJaTMo1sEJxkcRfjuQODB7BK8"
        }
      },
      {
        id: 5,
        color: "#B43E43",
        label: "Cannibale Royale",
        website: "http://www.cannibaleroyale.nl",
        category: "Restaurants",
        content: [
          "Cannibale Royale, brasserie extraordinaire fulfills all needs for anyone who loves good food, lots of meat, exotic beers and the most beautiful wines."
        ],
        author: {
          name: "Marie Bennett",
          role: "Architect",
          picture: "/app/assets/img/avatars/MarieBennett.jpg"
        },
        media: {
          x1: '/app/assets/img/x1/cannibaleroyale.jpg',
          x2: '/app/assets/img/x2/cannibaleroyale.jpg',
          x3: '/app/assets/img/x3/cannibaleroyale.jpg'
        },
        location: {
          place_id: "Ei5SdXlzZGFlbGthZGUgMTQ5LCAxMDcyIEFSIEFtc3RlcmRhbSwgTmVkZXJsYW5k"
        }
      },
      {
        id: 6,
        color: "#2A6E30",
        label: "Juice Brothers",
        website: "http://www.juicebro.com",
        category: "Healthy Bars",
        content: [
          "JuiceBrothers their goal is to create quality cold-pressed juice that is nutritiouand delicious as hell."
        ],
        author: {
          name: "Marie Bennett",
          role: "Architect",
          picture: "/app/assets/img/avatars/MarieBennett.jpg"
        },
        media: {
          x1: '/app/assets/img/x1/juicebrothers.jpg',
          x2: '/app/assets/img/x2/juicebrothers.jpg',
          x3: '/app/assets/img/x3/juicebrothers.jpg'
        },
        location: {
          place_id: "ChIJezIPCY8JxkcRgdqv8FrYp8U"
        }
      },
      {
        id: 7,
        color: "#c5a881",
        label: "Foodhallen",
        website: "http://www.foodhallen.nl",
        category: "Restaurants",
        content: [
          "Esse molestie consequat vel illum dolore eu feugiat. Modo typi qui nunc nobis videntur parum clari fiant sollemnes in. Ut laoreet dolore magna aliquam erat volutpat ut wisi enim. Per seacula quarta decima et quinta decima eodem. In iis qui facit eorum, claritatem Investigationes demonstraverunt lectores legere me. Eleifend option congue nihil imperdiet doming id quod mazim."
        ],
        author: {
          name: "Marie Bennett",
          role: "Architect",
          picture: "/app/assets/img/avatars/MarieBennett.jpg"
        },
        media: {
          x1: '/app/assets/img/x1/bloemenmarkt.jpg',
          x2: '/app/assets/img/x2/bloemenmarkt.jpg',
          x3: '/app/assets/img/x3/bloemenmarkt.jpg'
        },
        location: {
          place_id: "ChIJ3UYLU3XixUcRlxW4bSCFqdQ"
        }
      },
      {
        id: 8,
        color: "#A25935",
        label: "Lion Noir",
        website: "http://www.lionnoir.nl",
        region: "West",
        category: "Restaurants",
        content: [
          "Esse molestie consequat vel illum dolore eu feugiat. Modo typi qui nunc nobis videntur parum clari fiant sollemnes in. Ut laoreet dolore magna aliquam erat volutpat ut wisi enim. Per seacula quarta decima et quinta decima eodem. In iis qui facit eorum, claritatem Investigationes demonstraverunt lectores legere me. Eleifend option congue nihil imperdiet doming id quod mazim."
        ],
        author: {
          name: "Marie Bennett",
          role: "Architect",
          picture: "/app/assets/img/avatars/MarieBennett.jpg"
        },
        media: {
          x1: '/app/assets/img/x1/bloemenmarkt.jpg',
          x2: '/app/assets/img/x2/lionnoir.jpg',
          x3: '/app/assets/img/x3/lionnoir.jpg'
        },
        location: {
          place_id: "ChIJ6XBeeuoJxkcRxkGkr5WBeKw"
        }
      }
    ];

    // get places
    var service = new google.maps.places.PlacesService(map);

    function getPlaces() {
      for (var i = 0; i < marks.length; i += 1) {
        // Clousure keep reference while async requests come back
        (function(i) {
          var mark = marks[i];
          var position = i;
          service.getDetails({
            placeId: mark.location.place_id
          }, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              // populate mark with place info
              marks[position].place_info = results;
              marks[position].place = {
                placeId: results.place_id,
                location: results.geometry.location,
              };
              marks[position].address = results.formatted_address;
              marks[position].vicinity = results.vicinity;
            }
          });
        })(i);
      }
    }

    // SVG for unselected pins
    var pinSVGPath = "M0-50A17.38 17.38 0 0 0-17.5-32.5C-17.5-19.51 0 0 0 0S17.5-19.51 17.5-32.5A17.38 17.38 0 0 0 0-50Z";
    // SVG for selected pins
    var pinCircleSVGPath = "M0-50A17.38 17.38 0 0 0-17.5-32.5C-17.5-19.51 0 0 0 0S17.5-19.51 17.5-32.5A17.38 17.38 0 0 0 0-50ZM0-25a7.28 7.28 0 0 1-7.28-7.28A7.28 7.28 0 0 1 0-39.55a7.28 7.28 0 0 1 7.28 7.28A7.28 7.28 0 0 1 0-25Z";

    // construct a marker icon
    function markerIcon(options) {
      var icon = {
        path: options.path || pinCircleSVGPath,
        scale: options.scale || .75,
        strokeWeight: options.strokeWeight || 0,
        fillColor: options.fillColor || "#ffffff",
        fillOpacity: options.fillOpacity || .85,
        labelOrigin: new google.maps.Point(-2, -30)
      };
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
        fillColor: marker.mark.color
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
    function createMarker(mark, i) {
      var marker = getMarker(mark);
      if (!marker) {
        var raw = {
          mark: mark,
          place: mark.place,
          // {
          //   placeId: mark.location.place_id,
          //   location: {
          //     lat: mark.place.geometry.location.lat(),
          //     lng: mark.place.geometry.location.lng()
          //   }
          // },
          // position: {
          //   placeId: mark.place_id,
          //   lat: mark.place.geometry.location.lat(),
          //   lng: mark.place.geometry.location.lng()
          // },
          animation: google.maps.Animation.DROP,
          icon: markerIcon({ fillColor: mark.color })
        }
        marker = new google.maps.Marker(raw);
        marker.addListener('click', toggleMarker);
        markers.push(marker);
        $timeout(function() {
          marker.setMap(mapService.getMap());
        }, dropMarkTiming(i));
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
      if (isFiltering) filterByCategories();

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

    // create a collection of markers
    function dropMarkers(m) {
      var m = m || marks;
      for (var i = 0; i < m.length; i += 1) {
        createMarker(m[i], i);
      }
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
    function cleanFilteredMarkers() {
      filteredMarkers.splice(0, filteredMarkers.length);
    }

    // filter by categories
    function filterByCategories() {
      cleanFilteredMarkers();
      isFiltering = false;
      var categories = categoriesService.getSelectedCategories();
      if (categories.length) {
        for (var i = 0; i < marks.length; i += 1) {
          var isMarkerSelected = isMarkSelected(marks[i])
          var categoryIsSelected = categories.indexOf(marks[i].category) > -1;
          var categoryIsUndefined = typeof marks[i].category === 'undefined';
          if (isMarkerSelected || categoryIsSelected || categoryIsUndefined) {
            filteredMarkers.push(marks[i]);
          }
        }
      }
      if (filteredMarkers.length) {
        isFiltering = true;
        clearMarkers();
        $timeout(function () {
          dropMarkers(filteredMarkers);
        });
      }
      $rootScope.$emit('markersService:filtered-by-categories');
    }

    function restartMarkers() {
      isFiltering = false;
      cleanMarkers();
      cleanFilteredMarkers();
      $timeout(function () {
        dropMarkers();
      });
    }

    function getMarkerByLocation(location) {
      for (var i = 0; i < selectedMarkers.length; i += 1) {
        if (selectedMarkers[i].mark.address.indexOf(location) >= 0 || location.indexOf(selectedMarkers[i].mark.address) >= 0) {
          return angular.extend({}, selectedMarkers[i]);
        }
      }
      return false;
    }

    // delegate
    $rootScope.$on('mapController:restart-map', restartMarkers);
    $rootScope.$on('categoriesService:updated', filterByCategories);

    // public interface
    return {
      dropMarkers: dropMarkers,
      getMark: function(i) {
        return marks[i];
      },
      getMarks: function() {
        return marks;
      },
      getMarker: function(i) {
        return markers[i];
      },
      getMarkers: function() {
        return markers;
      },
      getSelectedMarkers: function() {
        return selectedMarkers;
      },
      getPlaces: getPlaces,
      getMarkerByLocation: getMarkerByLocation
    };
  }

})();
