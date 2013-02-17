/**
 * A GameAction that handles Mouse events
 * @name MouseAction
 * @constructor MouseAction
 * @extends {GameAction}
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  './GameAction'
], function(dcl, Mixer, GameAction){

  'use strict';

  return dcl([Mixer, GameAction], {
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
    position: null
  });

});