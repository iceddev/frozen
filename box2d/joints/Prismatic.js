/**
 * This represents a prismatic joint between two bodies.
 * This type of joint forces a body to keep its angle rotation consitent with another body
 * @name Prismatic
 * @constructor Prismatic
 * @extends Joint
 */

const Joint = require('./Joint');

// box2d globals
const B2Vec2 = Box2D.Common.Math.b2Vec2;
const B2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

class Prismatic extends Joint {
  constructor(options = {}){
    super(options);

    /**
     * An object with x and y numeric components representing the line in which the entities can move relative to each other
     * @type {Object}
     * @memberOf Prismatic#
     * @default
     */
    this.axisScale = null;

    Object.assign(this, options);
  }

  /**
   * Creates and adds this joint in the Box2d world.
   * @function
   * @memberOf Prismatic#
   * @param {Box} the box in which to create the joint.
   * @return {b2Joint} Joint created by box2d
   */
  createB2Joint(box){
    if(box && box.bodiesMap && box.b2World && box.jointsMap && !box.jointsMap[this.id]){
      const body1 = box.bodiesMap[this.bodyId1];
      const body2 = box.bodiesMap[this.bodyId2];
      if(body1 && body2){
        let vec1;
        if(this.bodyPoint1){
          vec1 = new B2Vec2(this.bodyPoint1.x, this.bodyPoint1.y);
        }
        vec1 = vec1 || body1.GetWorldCenter();
        var joint = new B2PrismaticJointDef();
        var axis;
        if(this.axisScale){
          axis = new B2Vec2(this.axisScale.x, this.axisScale.y);
        }else{
          axis = new B2Vec2(1, 0);
        }
        joint.Initialize(body1, body2, vec1, axis);

        if (this.jointAttributes) {
          Object.assign(joint, this.jointAttributes);
        }
        return box.b2World.CreateJoint(joint);
      }
    }
  }
}

module.exports = Prismatic;
