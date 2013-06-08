/**
 * This is a convenience object that allows for quickly creating a box2d based game.
 * @name BoxGame
 * @constructor BoxGame
 * @extends GameCore
 */

 define([
  '../GameCore',
  './Box',
  'lodash',
  'dcl'
], function(GameCore, Box, _, dcl){

  'use strict';

  var BoxGame = dcl(GameCore, {
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
     * @function preUpdate
     * @memberOf BoxGame#
     * @param  {Number} millis The milliseconds that have passed since last iteration of gameLoop
     * @deprecated Deprecated in favor of beforeUpdate
     */

    /**
     * Updates the Box before update() is called
     * @function
     * @memberOf BoxGame#
     * @param  {Number} millis The milliseconds that have passed since last iteration of gameLoop
     */
    beforeUpdate: function(millis){
      if(this.boxUpdating){
        this.box.update(millis);
        this.box.updateExternalState(this.entities);
      }
    },

    /**
     * Adds an Entity object to entities and box
     * @function
     * @memberOf BoxGame#
     * @param {Entity} entity Entity to add
     */
    addBody: function(entity){
      this.entities[entity.id] = entity;
      this.box.addBody(entity);
    },

    /**
     * Adds a series of Entity objects to entities and box
     * @function
     * @memberOf BoxGame#
     * @param {Array|Entity} entities Can take an array of Entity objects or any number of Entity objects
     */
    addBodies: function(){
      // allows for passing an array as first arg or a bunch of args
      var entities = _.flatten(arguments, true);
      var self = this;
      _.forEach(entities, function(entity){
        self.addBody(entity);
      });
    },

    /**
     * Removes an Entity object from entities and box
     * @function
     * @memberOf BoxGame#
     * @param  {Entity} entity Entity to remove
     */
    removeBody: function(entity){
      this.box.removeBody(entity.id);
      delete this.entities[entity.id];
    },

    /**
     * Removes a series of Entity objects from entities and box
     * @function
     * @memberOf BoxGame#
     * @param {Array|Entity} entities Can take an array of Entity objects or any number of Entity objects
     */
    removeBodies: function(){
      // allows for passing an array as first arg or a bunch of args
      var entities = _.flatten(arguments, true);
      var self = this;
      _.forEach(entities, function(entity){
        self.removeBody(entity);
      });
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
     * Adds a series of Joint objects to joints and box
     * @function
     * @memberOf BoxGame#
     * @param {Array|Joint} joints Can take an array of Joint objects or any number of Joint objects
     */
    addJoints: function(){
      // allows for passing an array as first arg or a bunch of args
      var joints = _.flatten(arguments, true);
      var self = this;
      _.forEach(joints, function(entity){
        self.addJoint(entity);
      });
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
    },

    /**
     * Removes a series of Joint objects from joints and box
     * @function
     * @memberOf BoxGame#
     * @param {Array|Joint} joints Can take an array of Joint objects or any number of Joint objects
     */
    removeJoints: function(){
      // allows for passing an array as first arg or a bunch of args
      var joints = _.flatten(arguments, true);
      var self = this;
      _.forEach(joints, function(entity){
        self.removeJoint(entity);
      });
    }
  });

  return BoxGame;

});