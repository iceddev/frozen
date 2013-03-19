define([
  'frozen/box2d/Box',
  'frozen/box2d/entities/MultiPolygon'
], function(Box, MultiPolygon){

  'use strict';

  var mpolyJSON = {id: 'a', polys: [[{x: -30, y: 0}, {x: 30, y: 0}, {x: 0, y: 30}],[{x: 30, y: 0}, {x: 90, y: 0}, {x: 30, y: 30}]], staticBody: false, x: 0, y: 0};

  describe('MultiPolygon Entity', function(){

    it('check defaults sizes', function(){
      var mpoly = new MultiPolygon();
      expect(mpoly.polys.length).toBe(0);
    });

    it('check defaults position', function(){
      var mpoly = new MultiPolygon();
      expect(mpoly.x).toBe(0);
      expect(mpoly.y).toBe(0);
    });

    it('check if enitity auto scales when added to a box', function(){
      var mpoly = new MultiPolygon(mpolyJSON);
      var box = new Box();
      box.addBody(mpoly);
      expect(mpoly.polys[0][0].x).toBe(-1);
    });

    it('check if enitity can explicitly scale', function(){
      var mpoly = new MultiPolygon(mpolyJSON);
      var box = new Box();
      mpoly.scaleShape(2);
      box.addBody(mpoly);
      expect(mpoly.polys[0][0].x).toBe(-60);
    });

    it('check if enitity contains point', function(){
      var mpoly = new MultiPolygon(mpolyJSON);
      var inside = mpoly.pointInShape({x: 1, y: 2});
      var inside2 = mpoly.pointInShape({x: 100, y: 200});
      expect(inside).toBe(true);
      expect(inside2).toBe(false);
    });


  });


});