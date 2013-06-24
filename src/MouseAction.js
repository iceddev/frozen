/**
 * A GameAction that handles Mouse events
 * @name MouseAction
 * @constructor MouseAction
 * @extends {GameAction}
 */

define([
  'dcl',
  './GameAction'
], function(dcl, GameAction){

  'use strict';

  return dcl(GameAction, {
    /**
     * Position where mousedown happened
     * @type {Point}
     * @memberOf MouseAction#
     * @default
     */
    startPosition: null,
    /**
     * Position where mouseup happened
     * @type {Point}
     * @memberOf MouseAction#
     * @default
     */
    endPosition: null,
    /**
     * Position where mousemove happened
     * @type {Point}
     * @memberOf MouseAction#
     * @default
     */
    position: null,
    /**
     * Wether the mouse action originated inside the canvas
     * @type {Boolean}
     * @memberOf MouseAction#
     * @default
     */
    insideCanvas: null,

    /**
     * Signals that the mouse was pressed.
     * @function
     * @memberOf GameAction#
     */
    press: dcl.superCall(function(sup){
      return function(startPosition){
        this.startPosition = startPosition;
        this.position = startPosition;
        sup.apply(this);
      };
    }),

    /**
     * Signals that the mouse was released
     * @function
     * @memberOf MouseAction#
     * @param  {Point} endPosition The point where mouse was released
     */
    release: dcl.superCall(function(sup){
      return function(endPosition){
        this.endPosition = endPosition;
        sup.apply(this);
      };
    })
  });

});