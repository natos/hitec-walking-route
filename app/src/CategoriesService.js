(function() {
  'use strict';
console.log('categoriesService')
  angular.module('map')
    .service('categoriesService', [
      '$rootScope', '$timeout',
      CategoriesService
    ]);

  /**
   * Users CategoriesService
   *
   * @returns {{getCategories: Function}}
   * @constructor
   */
  function CategoriesService($rootScope, $timeout) {

    var categories = ['Art & Museums', 'Restaurants', 'Markets', 'Healthy Bars', 'Breakfast & Lunch', 'Local Hotspots', 'Typical Amsterdam']

    var selectedCategories = [];

    function getCategories() {
      return categories;
    }

    function getSelectedCategories() {
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

    function updateCategories(event) {
      selectedCategories = event.targetScope.map.selectedCategories;
      $timeout(function() {
        $rootScope.$emit('categoriesService:updated');
      })
    }

    // delegate
    $rootScope.$on('mapController:restart-map', restartSelection);
    $rootScope.$on('categoriesDirective:changed', updateCategories);

    // public interface
    return {
      getCategories: getCategories,
      getSelectedCategories: getSelectedCategories,
      select: select,
      unselect: unselect,
      isSelected: isSelected
    };
  }

})();
