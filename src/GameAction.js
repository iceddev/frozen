/**
 * The GameAction handles DOM events for use in games.
 * @name GameAction
 * @constructor GameAction
 */

define([
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    /**
     * A name to reference the GameAction with
     * @type {String}
     * @memberOf GameAction#
     * @default
     */
    name: null,
    /**
     * Whether or not to detect only the intial press of the game action
     * @type {Number}
     * @memberOf GameAction#
     * @default
     */
    behavior: 0,
    /**
     * How many times the GameAction has been pressed
     * @type {Number}
     * @memberOf GameAction#
     * @default
     */
    amount: 0,
    /**
     * The current state of the GameAction
     * @type {Number}
     * @memberOf GameAction#
     * @default
     */
    state: 0,
    /**
     * A map of static constants for internal use
     * @type {Object}
     * @memberOf GameAction#
     * @property {Number} NORMAL Normal behavior. The isPressed() method returns true as long as the key is held down.
     * @property {Number} DETECT_INITAL_PRESS_ONLY Initial press behavior. The isPressed() method returns true only after the key is first pressed, and not again until the key is released and pressed again.
     * @property {Number} STATE_RELEASED Value for released state
     * @property {Number} STATE_PRESSED Value for pressed state
     * @property {Number} STATE_WAITING_FOR_RELEASE Value for waiting for release state
     * @property {Number} STATE_MOVED Value for moved state
     */
    statics: {
      NORMAL: 0,
      DETECT_INITAL_PRESS_ONLY: 1,

      STATE_RELEASED: 0,
      STATE_PRESSED: 1,
      STATE_WAITING_FOR_RELEASE: 2,
      STATE_MOVED: 3
    },

    constructor: function(){
      this.reset();
    },

    /**
     * Resets this GameAction so that it appears like it hasn't been pressed.
     * @function
     * @memberOf GameAction#
     */
    reset: function() {
      this.state = this.statics.STATE_RELEASED;
      this.amount = 0;
    },

    /**
     * Taps this GameAction. Same as calling press() followed by release().
     * @function
     * @memberOf GameAction#
     */
    tap: function() {
      this.press();
      this.release();
    },

    /**
     * Signals that the key was pressed.
     * @function
     * @memberOf GameAction#
     */
    press: function() {
      this.state = this.statics.STATE_PRESSED;
      if(this.behavior === this.statics.DETECT_INITAL_PRESS_ONLY){
        this.pressAmt(1);
      }
    },

    /**
     * Signals that the key was pressed a specified number of times, or that the mouse move a specified distance.
     * @function
     * @memberOf GameAction#
     * @param {Number} amount the number of times the key is pressed
     */
    pressAmt: function(amount) {
      if (this.state !== this.statics.STATE_WAITING_FOR_RELEASE) {
        this.amount += amount;
        this.state = this.statics.STATE_WAITING_FOR_RELEASE;
      }
    },

    /**
     * Signals that the key was released
     * @function
     * @memberOf GameAction#
     */
    release: function() {
      this.state = this.statics.STATE_RELEASED;
    },

    /**
     * Returns whether the key was pressed or not since last checked.
     * @function
     * @memberOf GameAction#
     * @return {Boolean} True if the key is pressed, else false
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
     * @function
     * @memberOf GameAction#
     * @return {Number} Number of times the key was pressed or distance mouse was moved
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