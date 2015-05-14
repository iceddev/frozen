/**
 * A GameAction that handles Mouse events
 * @name MouseAction
 * @constructor MouseAction
 * @extends {GameAction}
 */

'use strict';

const _ = require('lodash');
const GameAction = require('./GameAction');

class MouseAction extends GameAction {
  constructor(options){
    options = options || {};
    super(options);

    /**
     * Position where mousedown happened
     * @type {Point}
     * @memberOf MouseAction#
     * @default
     */
    this.startPosition = null;

    /**
     * Position where mouseup happened
     * @type {Point}
     * @memberOf MouseAction#
     * @default
     */
    this.endPosition = null;

    /**
     * Position where mousemove happened
     * @type {Point}
     * @memberOf MouseAction#
     * @default
     */
    this.position = null;

    /**
     * Wether the mouse action originated inside the canvas
     * @type {Boolean}
     * @memberOf MouseAction#
     * @default
     */
    this.insideCanvas = null;

    _.assign(this, options);

  }

  /**
   * Signals that the mouse was pressed.
   * @function
   * @memberOf GameAction#
   */
  press(startPosition){
    this.startPosition = startPosition;
    this.position = startPosition;
    super.press(startPosition);
  }

  /**
   * Signals that the mouse was released
   * @function
   * @memberOf MouseAction#
   * @param  {Point} endPosition The point where mouse was released
   */
  release(endPosition){
    this.endPosition = endPosition || this.position;
    super.release(endPosition);
  }
}

module.exports = MouseAction;
