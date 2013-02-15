/**
 * This is a convenience object that allows for quickly creating a box2d based game.
 * @name BoxGame
 * @class BoxGame
 * @extends GameCore
 * @property {Box} box The instance of Box used for this game.
 * @property {Boolean} boxUpdating Whether the box should perform calculations during its update cycle
 * @property {Object} entities A map of Entity objects that have are added to the Box
 */

 define([
  '../GameCore',
  './Box',
  'dcl',
  'dcl/bases/Mixer'
], function(GameCore, Box, dcl, Mixer){

  'use strict';

  return dcl([GameCore, Mixer], {
    box: null,
    boxUpdating: true,
    entities: null,

    constructor: function(){
      if(!this.box){
        this.box = new Box();
      }

      if(!this.entities){
        this.entities = {};
      }
    },

    preUpdate: function(millis){
      if(this.boxUpdating){
        this.box.update(millis);
        this.box.updateExternalState(this.entities);
      }
    }
  });

});