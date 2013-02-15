define([
  './utils/averagePoints',
  './utils/degreesToRadians',
  './utils/radiansToDegrees',
  './utils/pointInPolygon',
  './utils/distance',
  './utils/degreesFromCenter',
  './utils/radiansFromCenter',
  './utils/scalePoints',
  './utils/translatePoints',
  './utils/insideCanvas'
], function(averagePoints, degreesToRadians, radiansToDegrees, pointInPolygon, distance, degreesFromCenter, radiansFromCenter, scalePoints, translatePoints, insideCanvas){

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
      * @return {Object} an object with x and y values
      *
    */
    averagePoints: averagePoints,

    /**
      * Convert degrees to raidans
      * @name utils#degreesToRadians
      * @function
      * @param {Number} degrees
      * @return {Number} a value in radians
      *
    */
    degreesToRadians: degreesToRadians,

    /**
      * Convert radians to degrees
      * @name utils#radiansToDegrees
      * @function
      * @param {Number} radians
      * @return {Number} a value in degrees
      *
    */
    radiansToDegrees: radiansToDegrees,

    /**
      * Checks if a point is in a polygon
      * @name utils#pointInPolygon
      * @function
      * @param {Object} point Object with an x and y value
      * @param {Array} polygon Array of points
      * @return {Boolean} True if the point is inside the polygon
      *
    */
    pointInPolygon: pointInPolygon,

    /**
      * Returns the distance between 2 points
      * @name utils#distance
      * @function
      * @param {Object} point1 Object with an x and y value
      * @param {Object} point2 Object with an x and y value
      * @return {Number} the distance
      *
    */
    distance: distance,

    /**
      * Degrees a point is offset from a center point
      * @name utils#degreesFromCenter
      * @function
      * @param {Object} center Object with an x and y value
      * @param {Object} point Object with an x and y value
      * @return {Number} a value in degrees
      *
    */
    degreesFromCenter: degreesFromCenter,

    /**
      * Radians a point is offset from a center point
      * @name utils#radiansFromCenter
      * @function
      * @param {Object} center Object with an x and y value
      * @param {Object} point Object with an x and y value
      * @return {Number} a value in radians
      *
    */
    radiansFromCenter: radiansFromCenter,

    /**
      * Scale a point or array of points.
      * @name utils#scalePoints
      * @function
      * @param {Object|Array} points A point or array of points
      * @param {Object} scale Object with an x and y value
      * @return {Object|Array} a scaled point or array of points
      *
    */
    scalePoints: scalePoints,

    /**
      * Translate a point or array of points
      * @name utils#translatePoints
      * @function
      * @param {Object|Array} points A point or array of points
      * @param {Object} offset Object with an x and y value
      * @return {Object|Array} a translated point or array of points
      *
    */
    translatePoints: translatePoints,

    /**
     * Check whether a point is inside a canvas
     * @name utils#insideCanvas
     * @function
     * @param {Object} point A point to test
     * @param {Object} canvas Object with height and width properties
     * @return {Boolean} True if inside canvas else false
     */
    insideCanvas: insideCanvas
  };
});