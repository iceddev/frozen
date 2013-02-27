/**
 * AMD Plugin to load the correct Sound object
 * @module sounds/Sound
 * @example
 * define([
 *   'frozen/sounds/Sound!'
 * ], function(Sound){
 *
 *   // Use the generic sound object API here - the correct Sound object will be used
 *
 * });
 */

define([
  './AudioBase',
  './WebAudio',
  './HTML5Audio',
  'dojo/has'
], function(AudioBase, WebAudio, HTML5Audio, has){

  'use strict';

  return {
    load: function(id, parentRequire, loaded, config){
      if(has('WebAudio')){
        return loaded(WebAudio);
      }

      if(has('HTML5Audio')){
        return loaded(HTML5Audio);
      }

      return loaded(AudioBase);
    }
  };

});