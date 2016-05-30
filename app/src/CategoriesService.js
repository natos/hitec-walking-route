(function() {
  'use strict';
console.log('categoriesService')
  angular.module('map')
    .service('categoriesService', [
      '$rootScope', 'markersService',
      CategoriesService
    ]);

  /**
   * Users CategoriesService
   *
   * @returns {{getCategories: Function}}
   * @constructor
   */
  function CategoriesService($rootScope, markersService) {

    var categories = ['Art & Museums', 'Restaurants', 'Markets', 'Healthy Bars', 'Breakfast & Lunch', 'Local Hotspots', 'Typical Amsterdam']

    var selectedCategories = [];

    function getAll() {
      return categories;
    }

    function getSelected() {
      return selectedCategories;
    }

    function select(category) {
      selectedCategories.push(category);
    }

    function unselect(category) {
      var position = selectedCategories.indexOf(category);
      if (isSelected(category)) {
        selectedCategories.splice(position, 1);
      }
    }

    function isSelected(category) {
      return selectedCategories.indexOf(category) >= 0;
    }

    function restartSelection() {
      console.log('CategoriesService', 'RestartSelection');
      // for (var i = 0; i < selectedCategories.length; i += 1) {
      // }
      selectedCategories.splice(0, selectedCategories.length);
    }

    // delegate
    $rootScope.$on('mapController:restart-map', restartSelection);

    // public interface
    return {
      getAll: getAll,
      getSelected: getSelected,
      select: select,
      unselect: unselect,
      isSelected: isSelected
    };
  }

})();
