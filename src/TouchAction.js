/**
 * A GameAction that handles Touch events
 * @name TouchAction
 * @constructor TouchAction
 * @extends {GameAction}
 */

define([
  'dcl',
  './GameAction'
], function(dcl, GameAction){

  'use strict';

  return dcl(GameAction, {
    /**
     * Array of positions where touchstart happened
     * @type {Array}
     * @memberOf TouchAction#
     * @default
     */
    startPositions: null,
    /**
     * Array of positions where touchend happened
     * @type {Array}
     * @memberOf TouchAction#
     * @default
     */
    endPositions: null,
    /**
     * Array of positions where touchmove happened
     * @type {Array}
     * @memberOf TouchAction#
     * @default
     */
    positions: null,
    /**
     * Wether any of the touch actions originated inside the canvas
     * @type {Boolean}
     * @memberOf TouchAction#
     * @default
     */
    insideCanvas: null,

    /**
     * Signals that the touch was initiated.
     * @function
     * @memberOf TouchAction#
     * @param {Array} startPositions Array of points where touch was pressed
     */
    press: dcl.superCall(function(sup){
      return function(startPositions){
        this.startPositions = startPositions;
        this.positions = startPositions;
        sup.apply(this);
      };
    }),

    /**
     * Signals that the touch was released
     * @function
     * @memberOf TouchAction#
     * @param {Array} endPositions Array of points where touch was released
     */
    release: dcl.superCall(function(sup){
      return function(endPositions){
        this.endPositions = endPositions;
        sup.apply(this);
      };
    })
  });

});