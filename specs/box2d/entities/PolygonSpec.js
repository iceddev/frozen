define([
  'frozen/box2d/Box',
  'frozen/box2d/entities/Polygon'
], function(Box, Polygon){

  'use strict';

  var polyJSON = {id: 'a', points: [{x: -30, y: 0}, {x: 30, y: 0}, {x: 0, y: 30}], staticBody: false, x: 0, y: 0};

  describe('Polygon Entity', function(){

    it('check defaults sizes', function(){
      var poly = new Polygon();
      expect(poly.points.length).toBe(0);
    });

    it('check defaults position', function(){
      var poly = new Polygon();
      expect(poly.x).toBe(0);
      expect(poly.y).toBe(0);
    });

    it('check if enitity auto scales when added to a box', function(){
      var poly = new Polygon(polyJSON);
      var box = new Box();
      box.addBody(poly);
      expect(poly.points[0].x).toBe(-1);
    });

    it('check if enitity can explicitly scale', function(){
      var poly = new Polygon(polyJSON);
      var box = new Box();
      poly.scaleShape(2);
      box.addBody(poly);
      expect(poly.points[0].x).toBe(-60);
    });

    it('check if enitity contains point', function(){
      var poly = new Polygon(polyJSON);
      var inside = poly.pointInShape({x: 1, y: 2});
      var inside2 = poly.pointInShape({x: 100, y: 200});
      expect(inside).toBe(true);
      expect(inside2).toBe(false);
    });


  });


});