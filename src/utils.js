define([
  './utils/averagePoints',
  './utils/degreesToRadians',
  './utils/radiansToDegrees',
  './utils/pointInPolygon',
  './utils/distance',
  './utils/degreesFromCenter',
  './utils/radiansFromCenter',
  './utils/scalePoints',
  './utils/translatePoints'
], function(averagePoints, degreesToRadians, radiansToDegrees, pointInPolygon, distance, degreesFromCenter, radiansFromCenter, scalePoints, translatePoints){

  'use strict';

 /**
 * Math utility libraries
 * @name utils
 */
  return {

    /**
      * Gets the average point value in an array of points.
      * @name utils#averagePoints
      * @function
      * @param {Array} points
      *
    */
    averagePoints: averagePoints,

    /**
      * Convert degrees to raidans
      * @name utils#degreesToRadians
      * @function
      * @param {Number} degrees
      *
    */
    degreesToRadians: degreesToRadians,

    /**
      * Convert radians to degrees
      * @name utils#radiansToDegrees
      * @function
      * @param {Number} radians
      *
    */
    radiansToDegrees: radiansToDegrees,

    /**
      * Checks if a point is in a polygon
      * @name utils#pointInPolygon
      * @function
      * @param {Object} point Object with an x and y value
      * @param {Array} polygon Array of points
      *
    */
    pointInPolygon: pointInPolygon,

    /**
      * Returns the distance between 2 points
      * @name utils#distance
      * @function
      * @param {Object} point1 Object with an x and y value
      * @param {Object} point2 Object with an x and y value
      *
    */
    distance: distance,

    /**
      * Degrees a point is offset from a center point
      * @name utils#degreesFromCenter
      * @function
      * @param {Object} center Object with an x and y value
      * @param {Object} point Object with an x and y value
      *
    */
    degreesFromCenter: degreesFromCenter,

    /**
      * Radians a point is offset from a center point
      * @name utils#radiansFromCenter
      * @function
      * @param {Object} center Object with an x and y value
      * @param {Object} point Object with an x and y value
      *
    */
    radiansFromCenter: radiansFromCenter,

    /**
      * Scale a point or array of points.
      * @name utils#scalePoints
      * @function
      * @param {Object|Array} points A point or array of points
      * @param {Object} scale Object with an x and y value
      *
    */
    scalePoints: scalePoints,

    /**
      * Translate a point or array of points
      * @name utils#translatePoints
      * @function
      * @param {Object|Array} points A point or array of points
      * @param {Object} offset Object with an x and y value
      *
    */
    translatePoints: translatePoints
  };
});