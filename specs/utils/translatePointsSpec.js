define([
  'frozen/utils/translatePoints'
], function(translatePoints){

  'use strict';

  var singlePoint = {x: 1, y: 1};
  var pointArray = [{x: 1, y: 1}, {x: 2, y: 2}];

  describe('Translate Points', function(){
    it('check if a single point translates correctly', function(){
      var pt = translatePoints(singlePoint, {x: 2, y: 2});
      expect(pt.x).toEqual(3);
      expect(pt.y).toEqual(3);
    });

    it('check if a single point translates correctly at a non-square ratio', function(){
      var pt = translatePoints(singlePoint, 5);
      expect(pt.x).toEqual(1);
      expect(pt.y).toEqual(1);
    });

    it('check if a point array translates correctly', function(){
      var pts = translatePoints(pointArray, {x: 2, y: 2});
      expect(pts[0].x).toEqual(3);
      expect(pts[0].y).toEqual(3);
      expect(pts[1].x).toEqual(4);
      expect(pts[1].y).toEqual(4);
    });

    it('check if an exception is thrown if translation is not passed in', function(){
      expect(function(){translatePoints(singlePoint);}).toThrow();
    });

    it('check for error when no arguments passed in', function(){
      expect(function(){translatePoints();}).toThrow();
    });

    it('check a new object is returned from function', function(){
      var pt = translatePoints(singlePoint, {x: 2, y: 2});
      expect(pt.x).not.toEqual(singlePoint.x);
      expect(pt.y).not.toEqual(singlePoint.y);
    });


  });


});