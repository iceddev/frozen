define([
  'frozen/box2d/Box',
  'frozen/box2d/entities/Rectangle',
  'frozen/box2d/joints/Revolute'
], function(Box, Rectangle, Revolute){

  'use strict';

  var rectJSON = {id: 'a', halfHeight: 30, halfWidth: 60, staticBody: false, x: 30, y: 30};
  var rectJSON2 = {id: 'b', halfHeight: 60, halfWidth: 30, staticBody: false, x: 30, y: 30};

  describe('Revolute Joint', function(){

    var box, rect, rect2, extMap;

    beforeEach(function(){
      box = new Box();
      rect = new Rectangle(rectJSON);
      rect2 = new Rectangle(rectJSON2);
      extMap = {'a': rect, 'b': rect2};
    });


    it('check defaults body IDs', function(){
      var joint = new Revolute();
      expect(joint.bodyId1).toBeNull();
      expect(joint.bodyId2).toBeNull();
    });

    it('check defaults body points', function(){
      var joint = new Revolute();
      expect(joint.bodyPoint1).toBeNull();
    });


    it('check if joint is added to box', function(){
      box.addBody(rect);
      box.addBody(rect2);
      var joint = new Revolute({
        bodyId1: rect.id,
        bodyId2: rect2.id,
        id: 'j1'
      });
      box.addJoint(joint);
      expect(box.jointsMap[joint.id]).toBeDefined();
    });

    it('check if joint is removed from box', function(){
      box.addBody(rect);
      box.addBody(rect2);
      var joint = new Revolute({
        bodyId1: rect.id,
        bodyId2: rect2.id,
        id: 'j1'
      });
      box.addJoint(joint);
      box.removeJoint(joint.id);
      expect(box.jointsMap[joint.id]).not.toBeDefined();
    });

    it('check if joint point auto scales', function(){
      box.addBody(rect);
      box.addBody(rect2);
      var joint = new Revolute({
        bodyId1: rect.id,
        bodyId2: rect2.id,
        id: 'j1',
        bodyPoint1: {x: 30, y:30}
      });
      box.addJoint(joint);
      expect(joint.bodyPoint1.x).toBe(1);
      expect(joint.bodyPoint1.y).toBe(1);
    });

    it('check if joint point manually scales', function(){
      box.addBody(rect);
      box.addBody(rect2);
      var joint = new Revolute({
        bodyId1: rect.id,
        bodyId2: rect2.id,
        id: 'j1',
        bodyPoint1: {x: 30, y:30}
      });
      joint.scaleJointLocation(1/30);
      box.addJoint(joint);
      expect(joint.bodyPoint1.x).toBe(1);
      expect(joint.bodyPoint1.y).toBe(1);
    });

  });


});