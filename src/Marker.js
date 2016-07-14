angular
  .module('App')
  .service('Marker', [
    '$rootScope', '$mdDialog', '$timeout',
    'markersModel', 'appModel',
    'mapService', 'placesService', 'locationService',
    MarkerFactory
  ]);

/**
 * Marker factory
 */
function MarkerFactory($rootScope, $mdDialog, $timeout, markersModel, appModel, mapService, placesService, locationService) {

  /**
   * Marker contructor
   * @param {Place} place
   * @param {object|undefined} icon
   * @constructor
   */

  function Marker(place, icon) {

    var marker = this;

    var raw = {
      place: place.place,
      icon: markerIcon(icon||{})
    };

    this.pin = new google.maps.Marker(raw);
    this.place = place;

    if (this.place.selected) {
      this.select();
    }

    google.maps.event.addListener(this.pin, 'click', function() {
      marker.maximize.call(marker);
    });

    return this;
  };

  Marker.prototype.toggle = function() {
    if (this.place.selected) {
      this.unselect();
    } else {
      this.select();
    }
    return this;
  };

  Marker.prototype.order = function(order) {
    if (!order) {
      return this.place.order;
    }
    this.place.order = order;
    this.pin.setLabel({
      color: '#ffffff',
      text: '' + order
    });
    return this;
  };

  Marker.prototype.select = function() {
    var icon = markerIcon({
      scale: .75,
      path: markersModel.iconPath.selectedPin,
      fillColor: '#54bceb' // this.place.color
    });
    this.pin.setIcon(icon);
    if (this.place.order) {
      this.pin.setLabel({
        color: '#ffffff',
        text: '' + this.place.order
      });
    }
    this.place.selected = true;
    placesService.selectPlace(this.place);
    return this;
  };

  Marker.prototype.unselect = function() {
    var icon = markerIcon();
    this.pin.setIcon(icon);
    this.pin.setLabel({
      color: '#ffffff',
      text: ' '
    });
    this.place.selected = false;
    placesService.unselectPlace(this.place);
    return this;
  };

  Marker.prototype.isSelected = function() {
    return this.place.selected;
  };

  Marker.prototype.render = function(map) {
    this.pin.setMap(map);
    return this;
  };

  Marker.prototype.drop = function(map) {
    this.pin.setAnimation(google.maps.Animation.DROP);
    this.render(map);
    return this;
  };

  Marker.prototype.remove = function() {
    this.pin.setMap(null);
    return this;
  };

  Marker.prototype.maximize = function() {

    var marker = this;

    $mdDialog.show({
      controller: ['$scope', '$mdDialog', MarkerDetailController],
      clickOutsideToClose: true,
      parent: angular.element(document.body), //'#content',
      templateUrl: 'src/MarkerDetail.html'//,
      // fancy animations
      // openFrom: '.marker-' + marker.mark.id,
      // closeTo: '.marker-' + marker.mark.id
    });

    function triggerReroute() {
      $timeout(function() {
        $rootScope.$emit(appModel.events.prevState);
      }, 500);
    }

    function closeDialog() {
      $mdDialog.hide();
    };

    function addToRoute() {
      marker.select();
      placesService.selectPlace(marker.place);
      closeDialog();
      triggerReroute();
    }

    function removeFromRoute() {
      marker.unselect();
      placesService.unselectPlace(marker.place);
      closeDialog();
      triggerReroute();
    }

    function setStart() {
      placesService.setStartPlace(marker.place.id);
      addToRoute();
    }

    function setEnd() {
      placesService.setEndPlace(marker.place.id);
      addToRoute();
    }

    function hasAuthor() {
      return marker.place.author.name && marker.place.author.name !== '';
    }
    /**
     * Marker Detail controller
     */
    function MarkerDetailController($scope, $mdDialog) {
      $scope.marker = marker;
      $scope.addToRoute = addToRoute;
      $scope.removeFromRoute = removeFromRoute;
      $scope.setStart = setStart;
      $scope.setEnd = setEnd;
      $scope.closeDialog = closeDialog;
      $scope.hasAuthor = hasAuthor;
    }
  };

  // construct a marker icon
  function markerIcon(options) {
    var options = options || {};
    var icon = {
      path: options.path || markersModel.iconPath.unselectedPin,
      scale: options.scale || markersModel.iconDefaults.scale,
      strokeWeight: options.strokeWeight || markersModel.iconDefaults.strokeWeight,
      fillColor: options.fillColor || markersModel.iconDefaults.fillColor,
      fillOpacity: options.fillOpacity || markersModel.iconDefaults.fillOpacity,
      labelOrigin: options.labelOrigin || markersModel.iconDefaults.labelOrigin
    };
    return icon;
  }

  return Marker;
};
