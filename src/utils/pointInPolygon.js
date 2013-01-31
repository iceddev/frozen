define(function(){

  'use strict';

  // Using Ray-Casting formula based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  // and https://github.com/substack/point-in-polygon/
  // Re-written for most readability and for use with point objects instead of arrays

  function pointInPoly(point, polygon){
    if(!point || !polygon){
      return false;
    }

    var poly = polygon.points || polygon;

    var insidePoly = false;
    var j = poly.length - 1;

    for(var i = 0; i < poly.length; j = i++){
      var xi = poly[i].x;
      var yi = poly[i].y;
      var xj = poly[j].x;
      var yj = poly[j].y;

      if(yi > point.y !== yj > point.y){
        if(point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi){
          insidePoly = !insidePoly;
        }
      }
    }

    return insidePoly;
  }

  return pointInPoly;
});