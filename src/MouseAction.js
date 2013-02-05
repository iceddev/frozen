/**
 * A GameAction that handles Mouse events
 * @name MouseAction
 * @class MouseAction
 * @extends {GameAction}
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  './GameAction'
], function(dcl, Mixer, GameAction){

  'use strict';

  return dcl([Mixer, GameAction], {
    startPosition: null,
    endPosition: null,
    position: null
  });

});