define([
  'frozen/TouchAction',
  'frozen/GameAction',
  'dcl'
], function(TouchAction, GameAction, dcl){

  'use strict';

  describe('TouchAction', function(){
    var touchAction;
    var points = [{
      x: 12,
      y: 12
    }];

    beforeEach(function(){
      touchAction = new TouchAction();
    });

    it('should inherit from GameAction', function(){
      expect(dcl.isInstanceOf(touchAction, GameAction)).toBe(true);
    });

    it('should not have a startPosition by default', function(){
      expect(touchAction.startPositions).toBeNull();
    });

    it('should not have an endPosition by default', function(){
      expect(touchAction.endPositions).toBeNull();
    });

    it('should not have a position by default', function(){
      expect(touchAction.positions).toBeNull();
    });

    it('should set startPosition and position when press is called', function(){
      touchAction.press(points);
      expect(touchAction.startPositions).toBe(points);
      expect(touchAction.positions).toBe(points);
    });

    it('should set endPosition when release is called', function(){
      touchAction.release(points);
      expect(touchAction.endPositions).toBe(points);
    });

  });

});