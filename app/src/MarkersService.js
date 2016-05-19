(function(){
  'use strict';

  angular.module('map')
         .service('markersService', [MarkersService]);

  /**
   * Markers DataService
   *
   * @returns {{getMarkers: Function}}
   * @constructor
   */
  function MarkersService() {

    var marks = [
      {
        id: 1,
        label: "Anne Frank Huis",
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

    return {
      getMarkers: function() {
        return marks;
      }
    };
  }

})();
