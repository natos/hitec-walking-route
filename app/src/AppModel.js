(function(){
  'use strict';

  angular
    .module('App')
    .service('appModel', ['$rootScope', AppModel]);

    /**
     * App Model for Hi-Tec Walking Route
     * @param $rootScope
     * @constructor
     */
    function AppModel($rootScope) {

      /**
       * App states dictionary
       * @private
       */
      var states = {
        'PRISTINE': 1,
        'READY': 2,
        'SELECTING-PLACES': 3,
        'SELECTING-START-END': 4,
        'REVIEWING': 5,
        'PRINTING': 6,
        'THANK-YOU': 7
      };

      /**
       * Current App State
       * @default 1 'PRISTINE'
       * @private
       */
      var currentState = 1;

      /**
       * App Model events dictionary
       * @public
       */
      this.events = {
        nextState: 'app-model:next-state',
        prevState: 'app-model:prev-state',
        stateChanged: 'app-model:state-changed'
      };

      /**
       * Get current app state
       * @public
       * @return currentState
       */
      this.getState = function() {
        return currentState;
      };

      /**
       * Set current app state
       * @public
       * @param state
       */
      this.setState = function(state) {
        if (typeof state !== 'number') {
          if (!states[state]) {
            throw('AppModel: Unexpected state value.');
          } else {
            state = states[state];
          }
        }
        currentState = state;
        // comunicate state change
        $rootScope.$emit(this.events.stateChanged);
      };

      /**
       * Move to the next state in the dictionary
       * @public
       */
      this.next = function() {
        this.setState(currentState + 1);
      };

      /**
       * Move to the previous state in the dictionary
       * @public
       */
      this.prev = function() {
        this.setState(currentState - 1);
      };

      /**
       * Convenience methods to handle conditions
       * @public
       */
      this.state = {
        isPristine: function() {
          return currentState === states['PRISTINE'];
        },
        isReady: function() {
          return currentState === states['READY'];
        },
        isSelectingPlaces: function() {
          return currentState === states['SELECTING-PLACES'];
        },
        isSelectingStartEnd: function() {
          return currentState === states['SELECTING-START-END'];
        },
        isReviewing: function() {
          return currentState === states['REVIEWING'];
        },
        isPrinting: function() {
          return currentState === states['PRINTING'];
        },
        isFinish: function() {
          return currentState === states['THANK-YOU'];
        }
      };

    }

})();
