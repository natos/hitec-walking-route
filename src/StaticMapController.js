angular
  .module('App')
  .factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
  })
  .controller('StaticMapController', [
    '$scope', '$rootScope', '$window', '$timeout', '$http',
    'Base64', '$mdDialog',
    'appModel', 'mapModel',
    'mapService', 'directionsService',
    StaticMapController
  ]);

/**
 * Static Map Controller for Hi-Tec Walking Route
 * @param $scope
 * @param avatarsService
 * @constructor
 */
function StaticMapController($scope, $rootScope, $window, $timeout, $http, Base64, $mdDialog, appModel, mapModel, mapService, directionsService) {

  if (!google || !google.maps) {
    console.error('Google Maps API is unavailable.');
  }

  function resizeMap() {
    $timeout(triggerResize, 1);
    $timeout(mapService.getReady, 2);
  }

  function donePrinting() {
    angular.element(document.getElementById('map-container')).removeClass('printing-size');
    $timeout(resizeMap, 10);
  }

  function triggerResize() {
    window.dispatchEvent(new Event('resize'));
  }

  var self = this;

  self.staticMapURL = directionsService.getStaticMapWithDirections();

  self.cancel = function() {
    $rootScope.$emit(appModel.events.prevState);
  };

  self.email = function(ev) {
    var confirm = $mdDialog.prompt()
      .title('Please provide an email address')
      .textContent('Where do you want to send the instructions?')
      .placeholder('name@email.com')
      .ariaLabel('Send to:')
      .targetEvent(ev)
      .ok('Send')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function(to) {
      self.sendEmail(to);
    }, function() {

    });
  };

  self.sendEmail = function(to) {
    if (!to) return;
    // var emailLink = "mailto:me@example.com"
    //   + "?subject=" + escape("Hi-Tec Walking Routes")
    //   + "&body=" + directionsService.getDirectionsForEmail();
    //
    // $window.open(emailLink, "_self");

    // var url = "https://api.mailgun.net/v3/sandbox93fb6b2e4b4a48b89711c083ca8181d1.mailgun.org/messages";
    // var url = "http://localhost:3030/send/email";
    var url = "https://hitec-mail.herokuapp.com/send/email";
    var dataJSON = {
        from: "Hi-Tec Walking Routes <postmaster@sandbox93fb6b2e4b4a48b89711c083ca8181d1.mailgun.org>",
        to: to,
        subject: "Here's your custom walking route",
        // text: directionsService.getDirectionsForMailgun(),
        html: directionsService.getDirectionsForMailgun(),
        multipart: true
    };

    var req = {
        method : 'POST',
        // headers : {
        //     'content-type': 'application/x-www-form-urlencoded',
        //     'Authorization': 'Basic ' + Base64.encode('api:key-a14d1da4eed76f88ff3f955e51e7d742')
        // },
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: dataJSON
    };

    function feedbackDialog(text) {
      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Thank you')
          .textContent(text)
          .ok('Ok')
          .ariaLabel('Email feedback dialog')
      );
      $timeout($mdDialog.hide, 3000);
    }

    $http.post(url, dataJSON).then(function(data){
      feedbackDialog('Email was sent!');
    }, function(data){
      feedbackDialog('We found an error, plase try again.');
    });
  }

  self.print = function() {
    angular.element(document.getElementById('map-container')).addClass('printing-size');
    $timeout(resizeMap, 10);
    $timeout($window.print, 100);
  };

  $scope.$on('$destroy', function iVeBeenDismissed() {
    window.onbeforeprint = null;
    window.onafterprint = null;
  });

  (function() {
    var beforePrint = function() {
      // console.log('Functionality to run before printing.');
    };
    var afterPrint = function() {
      $timeout(donePrinting, 100);
    };

    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
          beforePrint();
        } else {
          afterPrint();
        }
      });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
  }());

}
