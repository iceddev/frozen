define([
  './utils/degreesToRadians',
  './utils/radiansToDegrees',
  './utils/pointInPolygon',
  './utils/distance',
  './utils/degreesFromCenter',
  './utils/radiansFromCenter'
], function(degreesToRadians, radiansToDegrees, pointInPolygon, distance, degreesFromCenter, radiansFromCenter){
   
  return {
    degreesToRadians: degreesToRadians,
    radiansToDegrees: radiansToDegrees,
    pointInPolygon: pointInPolygon,
    distance: distance,
    degreesFromCenter: degreesFromCenter,
    radiansFromCenter: radiansFromCenter
  };
});