/**
 * This contact listener for the Box2d world assigns collision objects to entities when they collide.
 * @name Contact
 * @constructor Contact
 */

define([
  'dcl',
  'dcl/bases/Mixer',
  'lodash'
], function(dcl, Mixer, _){

  'use strict';

  return dcl(Mixer, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf Contact#
     * @default
     */
    declaredClass: 'frozen/box2d/listeners/Contact',
    constructor: function(args){
      this.collisions = this.collisions || {};
    },
    /**
     * The the Box instance that contains the bodies that collide with each other.
     * @type {Box}
     * @memberOf Contact#
     * @default
     */
    box: null,

    /**
     * A map of collision objects
     * @type {Array}
     * @memberOf Contact#
     * @default
     */
    collisions: null,
    /**
     * updates the state of the contact listener per iteration of the box world calculations.
     * @function
     * @memberOf Contact#
     * @param {Number} millis The number of milliseconds since the last update.
     */
    update: function(millis){
      this.collisions = {};
    },
    /**
     * Called when a box2d collison begins
     * @function
     * @memberOf Contact#
     * @param {Object} b2Contact The box2d contact object.
     */
    beginContact: function(b2Contact){

    },
    /**
     * Called when a box2d collison ends
     * @function
     * @memberOf Contact#
     * @param {Object} b2Contact The box2d contact object.
    */
    endContact: function(b2Contact){

    },
    /**
     * Called before a box2d collison is resolved
     * @function
     * @memberOf Contact#
     * @param {Object} b2Contact The box2d contact object.
    */
    preSolve: function(b2Contact){

    },
    /**
     * Called after a box2d collison is resolved
     * @function
     * @memberOf Contact#
     * @param {Object} b2Contact The box2d contact object.
    */
    postSolve: function(b2Contact, impulse){
      var idA = b2Contact.GetFixtureA().GetBody().GetUserData();
      var idB = b2Contact.GetFixtureB().GetBody().GetUserData();
      this.collisions[idA] = this.collisions[idA] || [];
      this.collisions[idA].push({id: idB, impulse: impulse.normalImpulses[0]});
      this.collisions[idB] = this.collisions[idB] || [];
      this.collisions[idB].push({id: idA, impulse: impulse.normalImpulses[0]});
    }

  });

});