(function() {
  'use strict';

  angular.module('map')
    .service('printService', [
      '$rootScope',
      printService
    ]);

  /**
   * Print Service
   *
   * @constructor
   */
  function printService($rootScope) {


    var styles = "<style>.leg{margin-bottom:2em}.static-map-content .directions{opacity:.5;margin-bottom:1em}.static-map-content .instruction div{color:#ccc;padding:1em 1.5em}.static-map-content .end,.static-map-content .end md-icon svg,.static-map-content .start,.static-map-content .start md-icon svg{color:#666;fill:#666}.static-map-content .step{line-height:16px}.static-map-content .step md-icon{font-size:8px}.static-map-content .step md-icon svg{color:#ccc;fill:#ccc}.maneuver{background-size:19px 630px;display:inline-block;width:16px;height:16px;opacity:.75;background-image:url(http://maps.gstatic.com/mapfiles/api-3/images/maneuvers.png)}.maneuver.ferry{background-position:0 -614px}.maneuver.ferry-train{background-position:0 -566px}.maneuver.merge{background-position:0 -143px}.maneuver.straight{background-position:0 -534px}.maneuver.fork-left{background-position:0 -550px}.maneuver.ramp-left{background-position:0 -598px}.maneuver.roundabout-left{background-position:0 -197px}.maneuver.turn-left{background-position:0 -413px}.maneuver.turn-sharp-left{background-position:0 0}.maneuver.turn-slight-left{background-position:0 -378px}.maneuver.uturn-left{background-position:0 -305px}.maneuver.fork-right{background-position:0 -499px}.maneuver.ramp-right{background-position:0 -429px}.maneuver.roundabout-right{background-position:0 -232px}.maneuver.turn-right{background-position:0 -483px}.maneuver.turn-sharp-right{background-position:0 -582px}.maneuver.turn-slight-right{background-position:0 -51px}.maneuver.uturn-right{background-position:0 -35px}</style>";
    var printFunction = "<script>function printPage(){print();}</script>";

    function print(event) {

      var iframe = document.createElement('iframe');
      var content = styles + document.getElementById('static-map').innerHTML + printFunction;

      iframe.src = "data:text/html;charset=utf-8," + escape(content);
      //
      // iframeWindow.document.open();
      // iframeWindow.document.write(contetn);
      // iframeWindow.document.close();

      document.body.appendChild(iframe);

      console.log('iframe window', iframe);

      iframe.focus();
      iframe.printPage();

      // document.body.innerHTML = printContents;
      // window.print();
      // document.body.innerHTML = originalContents;
    }

    // delegate
    $rootScope.$on('mapController:print', print);
  }

})();
