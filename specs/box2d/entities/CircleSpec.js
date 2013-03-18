define([
  'frozen/box2d/Box',
  'frozen/box2d/entities/Circle'
], function(Box, Circle){

  'use strict';

  var circJSON = {id: 'a', radius: 30, staticBody: false, x: 0, y: 0};

  describe('Circle Entity', function(){

    it('check defaults sizes', function(){
      var circ = new Circle();
      expect(circ.radius).toBe(1);
    });

    it('check defaults position', function(){
      var circ = new Circle();
      expect(circ.x).toBe(0);
      expect(circ.y).toBe(0);
    });

    it('check if enitity auto scales when added to a box', function(){
      var circ = new Circle(circJSON);
      var box = new Box();
      box.addBody(circ);
      expect(circ.radius).toBe(1);
    });

    it('check if enitity can explicitly scale', function(){
      var circ = new Circle(circJSON);
      var box = new Box();
      circ.scaleShape(2);
      box.addBody(circ);
      expect(circ.radius).toBe(60);
    });

    it('check if enitity contains point', function(){
      var circ = new Circle(circJSON);
      var inside = circ.pointInShape({x: 1, y: 2});
      var inside2 = circ.pointInShape({x: 100, y: 200});
      expect(inside).toBe(true);
      expect(inside2).toBe(false);
    });


  });


});