/**
 * The GameAction handles DOM events for use in games.
 * @name GameAction
 * @constructor GameAction
 */

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
const statics = {
  NORMAL: 0,
  DETECT_INITAL_PRESS_ONLY: 1,
  STATE_RELEASED: 0,
  STATE_PRESSED: 1,
  STATE_WAITING_FOR_RELEASE: 2,
  STATE_MOVED: 3
};

class GameAction {
  constructor(options = {}){
    /**
     * A name to reference the GameAction with
     * @type {String}
     * @memberOf GameAction#
     * @default
     */
    this.name = null;

    /**
     * Whether or not to detect only the intial press of the game action
     * @type {Number}
     * @memberOf GameAction#
     * @default
     */
    this.behavior = 0;

    /**
     * How many times the GameAction has been pressed
     * @type {Number}
     * @memberOf GameAction#
     * @default
     */
    this.amount = 0;

    /**
     * The current state of the GameAction
     * @type {Number}
     * @memberOf GameAction#
     * @default
     */
    this.state = 0;

    this.statics = statics;

    Object.assign(this, options);

    this.reset();
  }

  /**
   * Resets this GameAction so that it appears like it hasn't been pressed.
   * @function
   * @memberOf GameAction#
   */
  reset() {
    this.state = statics.STATE_RELEASED;
    this.amount = 0;
  }

  /**
   * Taps this GameAction. Same as calling press() followed by release().
   * @function
   * @memberOf GameAction#
   */
  tap() {
    this.press();
    this.release();
  }

  /**
   * Signals that the key was pressed.
   * @function
   * @memberOf GameAction#
   */
  press() {
    this.state = statics.STATE_PRESSED;
    if(this.behavior === statics.DETECT_INITAL_PRESS_ONLY){
      this.pressAmt(1);
    }
  }

  /**
   * Signals that the key was pressed a specified number of times, or that the mouse move a specified distance.
   * @function
   * @memberOf GameAction#
   * @param {Number} amount the number of times the key is pressed
   */
  pressAmt(amount) {
    if (this.state !== statics.STATE_WAITING_FOR_RELEASE) {
      this.amount += amount;
      this.state = statics.STATE_WAITING_FOR_RELEASE;
    }
  }

  /**
   * Signals that the key was released
   * @function
   * @memberOf GameAction#
   */
  release() {
    this.state = statics.STATE_RELEASED;
  }

  /**
   * Returns whether the key was pressed or not since last checked.
   * @function
   * @memberOf GameAction#
   * @return {Boolean} True if the key is pressed, else false
   */
  isPressed() {
    if(this.state === statics.STATE_PRESSED){
      return true;
    } else {
      return false;
    }
  }

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
  getAmount() {
    var retVal = this.amount;
    if (retVal !== 0) {
      if (this.state === statics.STATE_RELEASED) {
        this.amount = 0;
      } else if (this.behavior === statics.DETECT_INITAL_PRESS_ONLY) {
        this.state = statics.STATE_WAITING_FOR_RELEASE;
        this.amount = 0;
      }
    }
    return retVal;
  }
}

module.exports = GameAction;
