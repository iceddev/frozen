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
  'lodash',
  '../ResourceManager',
  '../utils/parseString'
], function(_, ResourceManager, parseString){

  'use strict';

  var rm = new ResourceManager();

  return {
    load: function(resource, req, callback, config){
      resource = parseString(resource);
      if(typeof resource !== 'string'){
        _.forEach(resource, function(res){
          res = req.toUrl(res);
        });
      } else {
        resource = req.toUrl(resource);
      }
      var res = rm.loadImage(resource);
      callback(res);
    }
  };
});