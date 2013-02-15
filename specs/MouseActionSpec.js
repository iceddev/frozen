define([
  'frozen/MouseAction',
  'frozen/GameAction',
  'dcl'
], function(MouseAction, GameAction, dcl){

  'use strict';

  describe('MouseAction', function(){
    var mouseAction;

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

  });

});