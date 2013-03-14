define([
  'frozen/box2d/Box',
  'frozen/box2d/RectangleEntity',
  'frozen/box2d/joints/Revolute'
], function(Box, Rectangle, Revolute){

  'use strict';

  var rectJSON = {id: 'a', halfHeight: 5, halfWidth: 10, staticBody: false, x: 0, y: 0};
  var rectJSON2 = {id: 'b', halfHeight: 10, halfWidth: 5, staticBody: false, x: 0, y: 0};

  describe('Box', function(){

    var box, rect, extMap;

    beforeEach(function(){
      box = new Box();
      rect = new Rectangle(rectJSON);
      extMap = {'a': rect};
    });

    it('check the gravity default', function(){
      expect(box.gravityX).toBe(0);
      expect(box.gravityY).toBe(9.8);
    });

    it('check the scale default', function(){
      expect(box.scale).toBe(30);
    });

    it('check if can add body', function(){
      box.addBody(rect);
      expect(box.bodiesMap[rect.id]).toBeDefined();
    });

    it('check if can remove body', function(){
      box.addBody(rect);
      box.removeBody(rect.id);
      expect(box.bodiesMap[rect.id]).not.toBeDefined();
    });

    it('check if can update bodies', function(){

      box.addBody(rect);
      box.update(16);
      box.updateExternalState(extMap);
      expect(rect.linearVelocity).toBeDefined();
    });

    it('check if can set position', function(){
      box.addBody(rect);
      box.setPosition(rect.id, 10, 20);
      box.updateExternalState(extMap);
      expect(rect.x).toBe(10);
      expect(rect.y).toBe(20);
    });

    it('check if can set angle', function(){
      box.addBody(rect);
      box.setAngle(rect.id, 2);
      box.updateExternalState(extMap);
      expect(rect.angle).toBe(2);
    });

    it('check if can set linearVelocity', function(){
      box.addBody(rect);
      box.setLinearVelocity(rect.id, 10, 20);
      box.updateExternalState(extMap);
      expect(rect.linearVelocity.x).toBe(10);
      expect(rect.linearVelocity.y).toBe(20);
    });

    it('check if can apply impulse in degrees', function(){
      box.addBody(rect);
      box.applyImpulseDegrees(rect.id, 90, 20); //launch rect to the right
      box.update(16);
      box.updateExternalState(extMap);
      expect(rect.x > 0).toBe(true);
    });

    it('check if can apply force in degrees', function(){
      box.addBody(rect);
      box.applyForceDegrees(rect.id, 90, 20); //launch rect to the right
      box.update(16);
      box.updateExternalState(extMap);
      expect(rect.x > 0).toBe(true);
    });

    it('check if can apply impulse in radians', function(){
      box.addBody(rect);
      box.applyImpulseDegrees(rect.id, Math.PI / 2, 20); //launch rect to the right
      box.update(16);
      box.updateExternalState(extMap);
      expect(rect.x > 0).toBe(true);
    });

    it('check if can apply force in radians', function(){
      box.addBody(rect);
      box.applyForceDegrees(rect.id, Math.PI / 2, 20); //launch rect to the right
      box.update(16);
      box.updateExternalState(extMap);
      expect(rect.x > 0).toBe(true);
    });

    it('check if can add a joint', function(){
      var rect2 = new Rectangle(rectJSON2);
      extMap.b = rect2;
      box.addBody(rect);
      box.addBody(rect2);
      var joint = new Revolute({id: 'j1', bodyId1: rect.id, bodyId2: rect2.id});
      box.addJoint(joint);
      expect(box.jointsMap[joint.id]).toBeDefined();
    });

    it('check if can destroy a joint', function(){
      var rect2 = new Rectangle(rectJSON2);
      extMap.b = rect2;
      box.addBody(rect);
      box.addBody(rect2);
      var joint = new Revolute({id: 'j1', bodyId1: rect.id, bodyId2: rect2.id});
      box.addJoint(joint);
      box.destroyJoint(joint.id);
      expect(box.jointsMap[joint.id]).not.toBeDefined();
    });

  });


});