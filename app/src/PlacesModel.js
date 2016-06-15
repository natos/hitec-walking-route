(function(){
  'use strict';

  angular
    .module('App')
    .service('placesModel', ['$rootScope', PlacesModel]);

    /**
     * Places Controller for Hi-Tec Walking Route
     * @param $rootScope
     * @constructor
     */
    function PlacesModel($rootScope) {

      /**
       * Places Events dictionary
       * @public
       */
      this.events = {
        placesReady: 'placesService:places-ready'
      }

      /**
       * Places dictionary
       * @public
       */
      this.places = [
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
            // place_id: "ChIJz3y0xeIJxkcRNcogBVV41Gw"
            place_id: "ChIJYe2ad-QJxkcRURPt_bZPrmM"
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
            "JuiceBrothers their goal is to create quality cold-pressed juice that is nutritious and delicious as hell."
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

      /**
      * Places by category
      * @public
      */
      this.placesByCategory = {
        'Art & Museums': [],
        'Restaurants': [],
        'Markets': [],
        'Healthy Bars': [],
        'Brunch': [],
        'Local Hotspots': [],
        'Typical Amsterdam': []
      };

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

})();
