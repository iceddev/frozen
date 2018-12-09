/**
 * This is a convenience object that allows for quickly creating a box2d based game.
 * @name BoxGame
 * @constructor BoxGame
 * @extends GameCore
 */

const GameCore = require('../GameCore');
const Box = require('./Box');

class BoxGame extends GameCore {
  constructor(options = {}){
    super(options);
    console.log('boxgame options', options);
    /**
     * The instance of Box used for this game.
     * @type {Box}
     * @memberOf BoxGame#
     * @default
     */
    this.box = null;

    /**
     * Whether the box should perform calculations during its update cycle
     * @type {Boolean}
     * @memberOf BoxGame#
     * @default
     */
    this.boxUpdating = true;

    /**
     * A map of Entity objects that are added to the Box
     * @type {Object}
     * @memberOf BoxGame#
     * @default
     */
    this.entities = null;

    /**
     * A map of Joint objects that are added to the Box
     * @type {Object}
     * @memberOf BoxGame#
     * @default
     */
    this.joints = null;

    Object.assign(this, options);

    if(!this.box){
      this.box = new Box(options.boxOptions);
    }

    if(!this.entities){
      this.entities = {};
    }

    if(!this.joints){
      this.joints = {};
    }

  }

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
  beforeUpdate(millis){
    if(this.boxUpdating){
      this.box.update(millis);
      this.box.updateExternalState(this.entities);
    }
  }

  /**
   * Adds an Entity object to entities and box
   * @function
   * @memberOf BoxGame#
   * @param {Entity} entity Entity to add
   */
  addBody(entity){
    this.entities[entity.id] = entity;
    this.box.addBody(entity);
  }

  /**
   * Adds a series of Entity objects to entities and box
   * @function
   * @memberOf BoxGame#
   * @param {Array|Entity} entities Can take an array of Entity objects or any number of Entity objects
   */
  addBodies(entities){
    if(!Array.isArray(entities)) {
      entities = [entities];
    }
    var self = this;
    entities.forEach((entity) => {
      this.addBody(entity);
    });
  }

  /**
   * Removes an Entity object from entities and box
   * @function
   * @memberOf BoxGame#
   * @param  {Entity} entity Entity to remove
   */
  removeBody(entity){
    this.box.removeBody(entity.id);
    delete this.entities[entity.id];
  }

  /**
   * Removes a series of Entity objects from entities and box
   * @function
   * @memberOf BoxGame#
   * @param {Array|Entity} entities Can take an array of Entity objects or any number of Entity objects
   */
  removeBodies(entities){
    if(!Array.isArray(entities)) {
      entities = [entities];
    }
    entities.forEach((entity) => {
      this.removeBody(entity);
    });
  }

  /**
   * Adds a Joint to joints and box
   * @function
   * @memberOf BoxGame#
   * @param {Joint} joint Joint to add
   */
  addJoint(joint){
    this.joints[joint.id] = joint;
    this.box.addJoint(joint);
  }

  /**
   * Adds a series of Joint objects to joints and box
   * @function
   * @memberOf BoxGame#
   * @param {Array|Joint} joints Can take an array of Joint objects or any number of Joint objects
   */
  addJoints(joints){
    if(!Array.isArray(joints)) {
      joints = [joints];
    }
    joints.forEach((entity) => {
      this.addJoint(entity);
    });
  }

  /**
   * Removes a Joint from joints and box
   * @function
   * @memberOf BoxGame#
   * @param  {Joint} joint Joint to remove
   */
  removeJoint(joint){
    this.box.removeJoint(joint.id);
    delete this.joints[joint.id];
  }

  /**
   * Removes a series of Joint objects from joints and box
   * @function
   * @memberOf BoxGame#
   * @param {Array|Joint} joints Can take an array of Joint objects or any number of Joint objects
   */
  removeJoints(joints){
    if(!Array.isArray(joints)) {
      joints = [joints];
    }
    joints.forEach((entity) => {
      this.removeJoint(entity);
    });
  }
}

module.exports = BoxGame;

