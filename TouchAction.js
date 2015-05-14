/**
 * A GameAction that handles Touch events
 * @name TouchAction
 * @constructor TouchAction
 * @extends {GameAction}
 */

'use strict';

const _ = require('lodash');
const GameAction = require('./GameAction');

class TouchAction extends GameAction {
  constructor(options){
    options = options || {};
    super(options);

    /**
     * Array of positions where touchstart happened
     * @type {Array}
     * @memberOf TouchAction#
     * @default
     */
    this.startPositions = null;

    /**
     * Array of positions where touchend happened
     * @type {Array}
     * @memberOf TouchAction#
     * @default
     */
    this.endPositions = null;

    /**
     * Array of positions where touchmove happened
     * @type {Array}
     * @memberOf TouchAction#
     * @default
     */
    this.positions = null;

    /**
     * Wether any of the touch actions originated inside the canvas
     * @type {Boolean}
     * @memberOf TouchAction#
     * @default
     */
    this.insideCanvas = null;

    _.assign(this, options);

  }

  /**
   * Signals that the touch was initiated.
   * @function
   * @memberOf TouchAction#
   * @param {Array} startPositions Array of points where touch was pressed
   */
  press(startPositions){
    this.startPositions = startPositions;
    this.positions = startPositions;
    super.press(startPositions);
  }

  /**
   * Signals that the touch was released
   * @function
   * @memberOf TouchAction#
   * @param {Array} endPositions Array of points where touch was released
   */
  release(endPositions){
    this.endPositions = endPositions;
    super.release(endPositions);
  }
}

module.exports = TouchAction;
