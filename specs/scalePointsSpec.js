define([
  'frozen/utils/scalePoints'
], function(scalePoints){

  'use strict';

  var singlePoint = {x: 1, y: 1};
  var pointArray = [{x: 1, y: 1}, {x: 2, y: 2}];

  describe('Scale Points', function(){
    it('check if a single point scales correctly', function(){
      var pt = scalePoints(singlePoint, 2);
      expect(pt.x).toEqual(2);
      expect(pt.y).toEqual(2);
    });

    it('check if a single point scales correctly at a non-square ratio', function(){
      var pt = scalePoints(singlePoint, {x: 2, y: 4});
      expect(pt.x).toEqual(2);
      expect(pt.y).toEqual(4);
    });

    it('check if a point array scales correctly', function(){
      var pts = scalePoints(pointArray, 2);
      expect(pts[0].x).toEqual(2);
      expect(pts[0].y).toEqual(2);
      expect(pts[1].x).toEqual(4);
      expect(pts[1].y).toEqual(4);
    });

    it('check if a pt has NaN values if a scale is not passed in', function(){
      var pt = scalePoints(singlePoint);
      expect(isNaN(pt.x)).toEqual(true);
      expect(isNaN(pt.y)).toEqual(true);
    });

    it('check for error when no arguments passed in', function(){
      expect(function(){scalePoints();}).toThrow();
    });

    it('check a new object is returned from function', function(){
      var pt = scalePoints(singlePoint, 2);
      expect(pt.x).not.toEqual(singlePoint.x);
      expect(pt.y).not.toEqual(singlePoint.y);
    });


  });


});