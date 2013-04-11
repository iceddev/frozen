/**
 * This represents a distance joint between two bodies.
 * This type of joint forces two bodies to keep a constant distance for each other.
 * @name Distance
 * @constructor Distance
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
  var B2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;

  return dcl(Joint, {
    declaredClass: 'frozen/box2d/joints/Distance',
    /**
     * A point on the second entity where the joint will be attached. If no point is specified, the second body will be attached at its center point.
     * @type {Object}
     * @memberOf Distance#
     * @default
     */
    bodyPoint2: null,

    /**
     * Scales the positions bodies that the joint are connected at.
     * @function
     * @memberOf Distance#
     * @param {Number} scale the scale to multiply the dimentions by
     */
    scaleJointLocation: dcl.superCall(function(sup){
      return function(scale){
        if(scale && this.bodyPoint2){
          this.bodyPoint2.x = this.bodyPoint2.x * scale;
          this.bodyPoint2.y = this.bodyPoint2.y * scale;
          this.alreadyScaled = true;
        }
        sup.apply(this, [scale]);
      };
    }),

    /**
     * Creates and adds this joint in the Box2d world.
     * @function
     * @memberOf Distance#
     * @param {Box} the box in which to create the joint.
     * @return {b2Joint} Joint created by box2d
     */
    createB2Joint: function(box){
      if(box && box.bodiesMap && box.b2World && box.jointsMap && !box.jointsMap[this.id]){
        var body1 = box.bodiesMap[this.bodyId1];
        var body2 = box.bodiesMap[this.bodyId2];
        if(body1 && body2){
          var vec1, vec2;
          if(this.bodyPoint1){
            vec1 = new B2Vec2(this.bodyPoint1.x, this.bodyPoint1.y);
          }
          if(this.bodyPoint2){
            vec2 = new B2Vec2(this.bodyPoint2.x, this.bodyPoint2.y);
          }
          vec1 = vec1 || body1.GetWorldCenter();
          vec2 = vec2 || body2.GetWorldCenter();
          var joint = new B2DistanceJointDef();
          joint.Initialize(body1, body2, vec1, vec2);

          if (this.jointAttributes) {
            _.assign(joint, this.jointAttributes);
          }
          return box.b2World.CreateJoint(joint);
        }
      }
    }

  });

});