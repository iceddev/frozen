define([
  'frozen/utils/pointInPolygon'
], function(pointInPoly){

  'use strict';

  describe('Point In Polygon', function(){

    var points = [{"x":167,"y":181},{"x":168,"y":180},{"x":255,"y":124},{"x":298,"y":173},{"x":245,"y":262},{"x":150,"y":242}];

    it('returns true when given point is within set of points forming a polygon', function(){
      var point = {x:203, y:216};
      var inPoly = pointInPoly(point, points);
      expect(inPoly).toBe(true);
    });

    it('returns false when given point is not within set of points forming a polygon', function(){
      var point = {x:518, y:2268};
      var notInPoly = pointInPoly(point, points);
      expect(notInPoly).toBe(false);
    });

    it('returns false if not given a point', function(){
      var point = null;
      var notInPoly = pointInPoly(point, points);
      expect(notInPoly).toBe(false);
    });

    it('returns false if not given a valid point', function(){
      var point = {x:203};
      var notInPoly = pointInPoly(point, points);
      expect(notInPoly).toBe(false);
    });

    it('returns false if not given a set of points for second param', function(){
      var point = {x:203, y:216};
      var notInPoly = pointInPoly(point);
      expect(notInPoly).toBe(false);
    });

    it('returns false if not given a valid set of points for second param', function(){
      var point = {x:203, y:216};
      var points = [];
      var notInPoly = pointInPoly(point, points);
      expect(notInPoly).toBe(false);
    });

  });

});