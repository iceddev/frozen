/**
 * AMD Plugin for loading Images
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
      if(typeof resource !== 'string'){
        Object.keys(resource).forEach(function(key){
          resource[key] = req.toUrl(resource[key]);
        });
      } else {
        resource = req.toUrl(resource);
      }
      var res = rm.loadSound(resource);
      callback(res);
    }
  };
});