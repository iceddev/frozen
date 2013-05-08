define([
  'frozen/MouseAction',
  'frozen/GameAction',
  'dcl'
], function(MouseAction, GameAction, dcl){

  'use strict';

  describe('MouseAction', function(){
    var mouseAction;
    var point = {
      x: 12,
      y: 12
    };

    beforeEach(function(){
      mouseAction = new MouseAction();
    });

    it('should inherit from GameAction', function(){
      expect(dcl.isInstanceOf(mouseAction, GameAction)).toBe(true);
    });

    it('should not have a startPosition by default', function(){
      expect(mouseAction.startPosition).toBeNull();
    });

    it('should not have an endPosition by default', function(){
      expect(mouseAction.endPosition).toBeNull();
    });

    it('should not have a position by default', function(){
      expect(mouseAction.position).toBeNull();
    });

    it('should set startPosition and position when press is called', function(){
      mouseAction.press(point);
      expect(mouseAction.startPosition).toBe(point);
      expect(mouseAction.position).toBe(point);
    });

    it('should set endPosition when release is called', function(){
      mouseAction.release(point);
      expect(mouseAction.endPosition).toBe(point);
    });

  });

});