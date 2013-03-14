/**
 * AMD Plugin for loading Images
 * @module plugins/loadImage
 * @example
 * define([
 *   'frozen/plugins/loadImage!someImage.png'
 * ], function(someImage){
 *
 *   // Use someImage
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
      var res = rm.loadImage(resource);
      callback(res);
    }
  };
});