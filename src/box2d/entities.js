define([
  './entities/Circle',
  './entities/MultiPolygon',
  './entities/Polygon',
  './entities/Rectangle'
], function(){

  'use strict';

  /*
   * This returns a map of all the dependencies
   * Keyed by their declaredClass property (with package replaced)
   */

  var args = Array.prototype.slice.call(arguments);

  var entities = {};

  for(var idx = 0; idx < args.length; idx++){
    var type = args[idx];
    var key = type.prototype.declaredClass.replace('frozen/box2d/entities/', '');
    entities[key] = type;
  }

  return entities;

});