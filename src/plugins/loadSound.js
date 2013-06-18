/**
 * AMD Plugin for loading Sounds
 * @module plugins/loadSound
 * @example
 * define([
 *   'frozen/plugins/loadSound!someSound.wav'
 * ], function(someSound){
 *
 *   // Use someSound
 *
 * });
 */


define([
  '../ResourceManager',
  '../utils/parseString'
], function(ResourceManager, parseString){

  'use strict';

  var rm = new ResourceManager();

  return {
    load: function(resource, req, callback, config){
      resource = parseString(resource);
      var res = rm.loadSound(resource);
      callback(res);
    }
  };
});