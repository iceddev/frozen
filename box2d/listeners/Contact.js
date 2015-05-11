/**
 * This contact listener for the Box2d world assigns collision objects to entities when they collide.
 * @name Contact
 * @constructor Contact
 */

'use strict';

const _ = require('lodash');

class Contact {
  constructor(options){
    options = options || {};

    _.assign(this, options);

    this.collisions = this.collisions || {};
  }

  /**
   * Resets the state of the contact listener per iteration of the box world calculations.
   * @function
   * @memberOf Contact#
   */
  reset(){
    this.collisions = {};
  }

  /**
   * Called when a box2d collison begins
   * @function beginContact
   * @memberOf Contact#
   * @param {String} idA Id of body A
   * @param {String} idB Id of body B
   * @param {b2Contacnt} contact The box2d contact object.
   */

  /**
   * Called when a box2d collison ends
   * @function endContact
   * @memberOf Contact#
   * @param {String} idA Id of body A
   * @param {String} idB Id of body B
   * @param {b2Contact} contact The box2d contact object.
  */

  /**
   * Called before a box2d collison is resolved
   * @function preSolve
   * @memberOf Contact#
   * @param {String} idA Id of body A
   * @param {String} idB Id of body B
   * @param {Object} oldManifold Old manifold object passed into preSolve listener
   * @param {b2Contact} contact The box2d contact object.
  */

  /**
   * Called after a box2d collison is resolved
   * @function
   * @memberOf Contact#
   * @param {String} idA Id of body A
   * @param {String} idB Id of body B
   * @param {Object} impulse Impulse object passed into postSolve listener
   * @param {b2Contact} contact The box2d contact object.
  */
  postSolve(idA, idB, impulse, contact){
    this.collisions[idA] = this.collisions[idA] || [];
    this.collisions[idA].push({id: idB, impulse: impulse.normalImpulses[0]});
    this.collisions[idB] = this.collisions[idB] || [];
    this.collisions[idB].push({id: idA, impulse: impulse.normalImpulses[0]});
  }
}

module.exports = Contact;
