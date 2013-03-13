/**
 * AMD Plugin to load the correct Sound object
 * @module plugins/sound
 * @example
 * define([
 *   'frozen/plugins/sound!'
 * ], function(Sound){
 *
 *   // Use the generic sound object API here - the correct Sound object will be used
 *
 * });
 */

define([
  '../sounds/Sound',
  '../sounds/WebAudio',
  '../sounds/HTML5Audio',
  'dojo/has'
], function(Sound, WebAudio, HTML5Audio, has){

  'use strict';

  return {
    load: function(id, parentRequire, loaded, config){
      if(has('WebAudio')){
        return loaded(WebAudio);
      }

      if(has('HTML5Audio')){
        return loaded(HTML5Audio);
      }

      return loaded(Sound);
    }
  };

});