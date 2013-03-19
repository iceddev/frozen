/**
 * This is a convenience object that allows for quickly creating a box2d based game.
 * @name BoxGame
 * @constructor BoxGame
 * @extends GameCore
 */

 define([
  '../GameCore',
  './Box',
  'dcl'
], function(GameCore, Box, dcl){

  'use strict';

  return dcl(GameCore, {
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
     * A map of Entity objects that are added to the Box
     * @type {Object}
     * @memberOf BoxGame#
     * @default
     */
    entities: null,
    /**
     * A map of Joint objects that are added to the Box
     * @type {Object}
     * @memberOf BoxGame#
     * @default
     */
    joints: null,

    constructor: function(){
      if(!this.box){
        this.box = new Box();
      }

      if(!this.entities){
        this.entities = {};
      }

      if(!this.joints){
        this.joints = {};
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
    },

    /**
     * Adds an Entity to entities and box
     * @function
     * @memberOf BoxGame#
     * @param {Entity} entity Entity to add
     */
    addBody: function(entity){
      this.entities[entity.id] = entity;
      this.box.addBody(entity);
    },

    /**
     * Removes an Entity from entities and box
     * @function
     * @memberOf BoxGame#
     * @param  {Entity} entity Entity to remove
     */
    removeBody: function(entity){
      this.box.removeBody(entity.id);
      delete this.entities[entity.id];
    },

    /**
     * Adds a Joint to joints and box
     * @function
     * @memberOf BoxGame#
     * @param {Joint} joint Joint to add
     */
    addJoint: function(joint){
      this.joints[joint.id] = joint;
      this.box.addJoint(joint);
    },

    /**
     * Removes a Joint from joints and box
     * @function
     * @memberOf BoxGame#
     * @param  {Joint} joint Joint to remove
     */
    removeJoint: function(joint){
      this.box.removeJoint(joint.id);
      delete this.joints[joint.id];
    }
  });

});