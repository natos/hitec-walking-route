(function(){
  'use strict';

  angular.module('map')
    .service('markersService', [
      '$rootScope', '$timeout', 'mapService',
      MarkersService
    ]);

  /**
   * Markers DataService
   *
   * @returns {{getMarkers: Function}}
   * @constructor
   */
  function MarkersService($rootScope, $timeout, mapService) {

    var markers = [];

    var selectedMarkers = [];

    var marks = [
      {
        id: 1,
        label: "Anne Frank Huis",
        color: "#1D8800",
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
        position: {
          lat: 52.3752215,
          lng: 4.8817825
        }
      },
      {
        id: 2,
        label: "Hi-Tec Store",
        color: "#2688FF",
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
        position: {
          lat: 52.3620861,
          lng: 4.8824255
        }
      },
      {
        id: 3,
        label: "Vondelpark",
        color: "#7F007F",
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
        position: {
          lat: 52.3579979,
          lng: 4.8664597
        }
      },
      {
        id: 4,
        label: "Bloemenmarkt",
        color: "#E37F00",
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
        position: {
          lat: 52.3668379,
          lng: 4.8891147
        }
      }
    ];

    // <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.21 27.23"><defs><style>.cls-1{fill:#999;}</style></defs><title>pin</title><path class="cls-1" d="M20.21,10.1c0,5.58-9.25,17.13-10.1,17.13S0,15.68,0,10.1A10.1,10.1,0,1,1,20.21,10.1Z"/></svg>
    var pinSVGPath = "M27.648 -41.399q0 -3.816 -2.7 -6.516t-6.516 -2.7 -6.516 2.7 -2.7 6.516 2.7 6.516 6.516 2.7 6.516 -2.7 2.7 -6.516zm9.216 0q0 3.924 -1.188 6.444l-13.104 27.864q-0.576 1.188 -1.71 1.872t-2.43 0.684 -2.43 -0.684 -1.674 -1.872l-13.14 -27.864q-1.188 -2.52 -1.188 -6.444 0 -7.632 5.4 -13.032t13.032 -5.4 13.032 5.4 5.4 13.032z";
    // var pinSVGPath = "M20.21,10.1c0,5.58-9.25,17.13-10.1,17.13S0,15.68,0,10.1A10.1,10.1,0,1,1,20.21,10.1Z";

    function createMarker(mark, i) {
      $timeout(function() {
        var marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          position: mark.position,
          mark: mark,
          map: mapService.getMap(),
          icon: {
            path: pinSVGPath,
            scale: .6,
            strokeWeight: 0,
            fillColor: mark.color,
            fillOpacity: 0.85
          }
        });
        marker.addListener('click', toggleMarker);
      }, dropMarkTiming);
    }

    function dropMarkTiming(i) {
      return (i + .75) * 350;
    }

    function toggleMarker() {
      // map.setCenter(this.getPosition());
      // reset pin label
      this.setLabel('');
      var labelId = 'label_' + this.mark.id;
      var position = selectedMarkers.indexOf(this);
      var isAlreadySelected = position >= 0;
      if (isAlreadySelected) {
        selectedMarkers.splice(position, 1);
      } else {
        var order = selectedMarkers.push(this);
        this.mark.order = order;
      }
      reorderMarkers();
      $rootScope.$emit('markersService:toggled-mark', this);
      if (!$rootScope.$$phase) $rootScope.$apply();
    }

    function reorderMarkers() {
      for (var i = 0; i < selectedMarkers.length; i += 1) {
        selectedMarkers[i].mark.order = i+1;
        selectedMarkers[i].setLabel(''+(i+1));
      }
    }

    function dropMarkers() {
      for (var i = 0; i < marks.length; i += 1) {
        var mark = marks[i];
        createMarker(mark, i);
      }
    }

    return {
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
      dropMarkers: dropMarkers
    };
  }

})();
