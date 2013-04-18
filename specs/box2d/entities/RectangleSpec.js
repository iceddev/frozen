define([
  'frozen/box2d/Box',
  'frozen/box2d/entities/Rectangle'
], function(Box, Rectangle){

  'use strict';

  var rectJSON = {id: 'a', halfHeight: 30, halfWidth: 60, staticBody: false, x: 0, y: 0};

  describe('Rectangle Entity', function(){

    it('check defaults sizes', function(){
      var rect = new Rectangle();
      expect(rect.halfWidth).toBe(1);
      expect(rect.halfHeight).toBe(1);
    });

    it('check defaults position', function(){
      var rect = new Rectangle();
      expect(rect.x).toBe(0);
      expect(rect.y).toBe(0);
    });

    it('check if enitity auto scales when added to a box', function(){
      var rect = new Rectangle(rectJSON);
      var box = new Box();
      box.addBody(rect);
      expect(rect.halfWidth).toBe(2);
      expect(rect.halfHeight).toBe(1);
    });

    it('check if enitity can explicitly scale', function(){
      var rect = new Rectangle(rectJSON);
      var box = new Box();
      rect.scaleShape(2);
      box.addBody(rect);
      expect(rect.halfWidth).toBe(120);
      expect(rect.halfHeight).toBe(60);
    });

    it('check if enitity contains point', function(){
      var rect = new Rectangle(rectJSON);
      var inside = rect.pointInShape({x: 1, y: 2});
      var inside2 = rect.pointInShape({x: 100, y: 200});
      expect(inside).toBe(true);
      expect(inside2).toBe(false);
    });


  });


});