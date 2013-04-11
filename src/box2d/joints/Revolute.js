/**
 * This represents a revolute joint between two bodies.
 * This allow for rotation of one body around a point of another.
 * @name Revolute
 * @constructor Revolute
 * @extends Joint
 */

define([
  'dcl',
  'lodash',
  './Joint'
], function(dcl, _, Joint){

  'use strict';

  // box2d globals
  var B2Vec2 = Box2D.Common.Math.b2Vec2;
  var B2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

  return dcl(Joint, {
    declaredClass: 'frozen/box2d/joints/Revolute',
    /**
     * Creates and adds this joint in the Box2d world.
     * @function
     * @memberOf Revolute#
     * @param {Box} the box in which to create the joint.
     * @return {b2Joint} Joint created by box2d
     */
    createB2Joint: function(box){
      if(box && box.bodiesMap && box.b2World && box.jointsMap && !box.jointsMap[this.id]){
        var body1 = box.bodiesMap[this.bodyId1];
        var body2 = box.bodiesMap[this.bodyId2];
        if(body1 && body2){
          var vec1;
          if(this.bodyPoint1){
            vec1 = new B2Vec2(this.bodyPoint1.x, this.bodyPoint1.y);
          }
          vec1 = vec1 || body1.GetWorldCenter();
          var joint = new B2RevoluteJointDef();
          var axis;
          joint.Initialize(body1, body2, vec1, axis);

          if (this.jointAttributes) {
            _.assign(joint, this.jointAttributes);
          }
          return box.b2World.CreateJoint(joint);
        }
      }
    }

  });

});