(function(){
  'use strict';

  angular
    .module('WalkingRouteApp', ['ngMaterial', 'map'])
    .config(function($mdThemingProvider, $mdIconProvider) {

      $mdIconProvider
          .icon("close", "./assets/svg/ic_close_white_24px.svg" , 24)
          .icon("refresh", "./assets/svg/ic_refresh_white_24px.svg" , 24)
          .icon("my_location", "./assets/svg/ic_my_location_white_24px.svg" , 24)
          .icon("more_vert", "./assets/svg/ic_more_vert_white_24px.svg" , 24)
          ;

      $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('red');

    });

})();
