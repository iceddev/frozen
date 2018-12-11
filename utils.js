const averagePoints = require('./utils/averagePoints');
const degreesToRadians = require('./utils/degreesToRadians');
const radiansToDegrees = require('./utils/radiansToDegrees');
const pointInPolygon = require('./utils/pointInPolygon');
const distance = require('./utils/distance');
const degreesFromCenter = require('./utils/degreesFromCenter');
const radiansFromCenter = require('./utils/radiansFromCenter');
const scalePoints = require('./utils/scalePoints');
const translatePoints = require('./utils/translatePoints');
const insideCanvas = require('./utils/insideCanvas');


/**
 * Math utility libraries
 * @exports utils
 */
const utils = {
  /**
   * Gets the average point value in an array of points.
   * @function
   * @param {Array} points
   * @return {Object} An object with x and y values
   */
  averagePoints,

  /**
   * Convert degrees to raidans
   * @function
   * @param {Number} degrees
   * @return {Number} A value in radians
   */
  degreesToRadians,

  /**
   * Convert radians to degrees
   * @function
   * @param {Number} radians
   * @return {Number} A value in degrees
   */
  radiansToDegrees,

  /**
   * Checks if a point is in a polygon
   * @function
   * @param {Object} point Object with an x and y value
   * @param {Array} polygon Array of points
   * @return {Boolean} True if the point is inside the polygon
   */
  pointInPolygon,

  /**
   * Returns the distance between 2 points
   * @function
   * @param {Object} point1 Object with an x and y value
   * @param {Object} point2 Object with an x and y value
   * @return {Number} The distance
   */
  distance,

  /**
   * Degrees a point is offset from a center point
   * @function
   * @param {Object} center Object with an x and y value
   * @param {Object} point Object with an x and y value
   * @return {Number} A value in degrees
   */
  degreesFromCenter,

  /**
   * Radians a point is offset from a center point
   * @function
   * @param {Object} center Object with an x and y value
   * @param {Object} point Object with an x and y value
   * @return {Number} A value in radians
   */
  radiansFromCenter,

  /**
   * Scale a point or array of points.
   * @function
   * @param {Object|Array} points A point or array of points
   * @param {Object} scale Object with an x and y value
   * @return {Object|Array} A scaled point or array of points
   */
  scalePoints,

  /**
   * Translate a point or array of points
   * @function
   * @param {Object|Array} points A point or array of points
   * @param {Object} offset Object with an x and y value
   * @return {Object|Array} A translated point or array of points
   */
  translatePoints,

  /**
   * Check whether a point is inside a canvas
   * @function
   * @param {Object} point A point to test
   * @param {Object} canvas Object with height and width properties
   * @return {Boolean} True if inside canvas else false
   */
  insideCanvas
};

module.exports = utils;
