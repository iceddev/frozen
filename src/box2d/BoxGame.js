/**
 * This is a convenience object that allows for quickly creating a box2d based game.
 * @name BoxGame
 * @constructor BoxGame
 * @extends GameCore
 */

 define([
  '../GameCore',
  './Box',
  'dcl',
  'dcl/bases/Mixer'
], function(GameCore, Box, dcl, Mixer){

  'use strict';

  return dcl([GameCore, Mixer], {
    /**
     * The instance of Box used for this game.
     * @type {Box}
     * @memberOf BoxGame#
     * @default
     */
    box: null,
    /**
     * Whether the box should perform calculations during its update cycle
     * @type {Boolean}
     * @memberOf BoxGame#
     * @default
     */
    boxUpdating: true,
    /**
     * A map of Entity objects that have are added to the Box
     * @type {Object}
     * @memberOf BoxGame#
     * @default
     */
    entities: null,

    constructor: function(){
      if(!this.box){
        this.box = new Box();
      }

      if(!this.entities){
        this.entities = {};
      }
    },

    /**
     * Updates the Box before update() is called
     * @function
     * @memberOf BoxGame#
     * @param  {Number} millis The milliseconds that have passed since last iteration of gameLoop
     */
    preUpdate: function(millis){
      if(this.boxUpdating){
        this.box.update(millis);
        this.box.updateExternalState(this.entities);
      }
    }
  });

});