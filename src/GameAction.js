/**
 * The GameAction handles DOM events for use in games.
 * @name GameAction
 * @class GameAction
 */

define([
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    name: null,
    behavior: 0,
    amount:  0,
    state: 0,
    statics: {
      /**
        Normal behavior. The isPressed() method returns true as long as the key is held down.
      */
      NORMAL: 0,
      /**
        Initial press behavior. The isPressed() method returns true only after the key is first pressed,
        and not again until the key is released and pressed again.
      */
      DETECT_INITAL_PRESS_ONLY: 1,

      STATE_RELEASED: 0,
      STATE_PRESSED: 1,
      STATE_WAITING_FOR_RELEASE: 2,
      STATE_MOVED: 3
    },

    constructor: function(){
      this.reset();
    },

    getName: function() {
      return this.name;
    },

    /**
      * Resets this GameAction so that it appears like it hasn't been pressed.
      * @name GameAction#reset
      * @function
      *
    */
    reset : function() {
      this.state = this.statics.STATE_RELEASED;
      this.amount = 0;
    },

    /**
      * Taps this GameAction. Same as calling press() followed by release().
      * @name GameAction#tap
      * @function
      *
    */
    tap: function() {
      this.press();
      this.release();
    },

    /**
      * Signals that the key was pressed.
      * @name GameAction#press
      * @function
      *
    */
    press: function() {
      this.state = this.statics.STATE_PRESSED;
      if(this.behavior === this.statics.DETECT_INITAL_PRESS_ONLY){
        this.pressAmt(1);
      }
    },

    /**
      * Signals that the key was pressed a specified number of times, or that the mouse move a specified distance.
      * @name GameAction#pressAmt
      * @function
      * @param {Number} amount the number of times the key is pressed
      *
    */
    pressAmt: function(amount) {
      if (this.state !== this.statics.STATE_WAITING_FOR_RELEASE) {
        this.amount += amount;
        this.state = this.statics.STATE_WAITING_FOR_RELEASE;
      }
    },

    /**
      * Signals that the key was released
      * @name GameAction#release
      * @function
      *
    */
    release: function() {
      this.state = this.statics.STATE_RELEASED;
    },

    /**
      * Returns whether the key was pressed or not since last checked.
      * @name GameAction#isPressed
      * @function
      *
    */
    isPressed: function() {
      if(this.state === this.statics.STATE_PRESSED){
        return true;
      } else {
        return false;
      }
    },

    /**
      * For keys, this is the number of times the key was pressed since it was last checked.
      * For mouse movement, this is the distance moved.
      *
      * This Resets the amount to zero after being checked!
      *
      * @name GameAction#getAmount
      * @function
      *
    */
    getAmount: function() {
      var retVal = this.amount;
      if (retVal !== 0) {
        if (this.state === this.statics.STATE_RELEASED) {
          this.amount = 0;
        } else if (this.behavior === this.statics.DETECT_INITAL_PRESS_ONLY) {
          this.state = this.statics.STATE_WAITING_FOR_RELEASE;
          this.amount = 0;
        }
      }
      return retVal;
    }
  });

});