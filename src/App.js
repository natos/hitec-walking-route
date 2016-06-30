angular
  .module('App', ['ngSanitize', 'ngMaterial'])
  .config(function($mdThemingProvider, $mdIconProvider) {

    $mdIconProvider
      .icon("start_over", "./assets/svg/ic_arrow_back_white_24px.svg" , 24)
      .icon("directions", "./assets/svg/ic_directions_black_24px.svg" , 24)
      .icon("walk", "./assets/svg/ic_directions_walk_white_24px.svg" , 24)
      .icon("walking_blue", "./assets/svg/ic_directions_walk_blue_mod_24px.svg" , 24)
      .icon("place", "./assets/svg/ic_place_white_24px.svg" , 24)
      .icon("place_dark", "./assets/svg/ic_place_black_24px.svg" , 24)
      .icon("close", "./assets/svg/ic_close_white_24px.svg" , 24)
      .icon("email", "./assets/svg/ic_email_white_24px.svg" , 24)
      .icon("print", "./assets/svg/ic_print_white_24px.svg" , 24)
      .icon("refresh", "./assets/svg/ic_refresh_white_24px.svg" , 24)
      .icon("my_location", "./assets/svg/ic_my_location_white_24px.svg" , 24)
      .icon("more_vert", "./assets/svg/ic_more_vert_white_24px.svg" , 24)
      ;

    $mdThemingProvider
      .theme('default')
      .primaryPalette('blue')
      .accentPalette('red');

  });
