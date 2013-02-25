/**
 * An Audio object that implements HTML5 Audio into a generic API
 * @name HTML5Audio
 * @constructor HTML5Audio
 * @extends Audio
 */

define([
  './Audio',
  'dcl',
  'dojo/on',
  'dojo/_base/lang'
], function(Audio, dcl, on, lang){

  'use strict';

  return dcl(Audio, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf HTML5Audio#
     * @default
     */
    declaredClass: 'frozen/sounds/HTML5Audio',
    /**
     * The initial Audio object - used to load the sound prior to playing
     * @type {Audio}
     * @memberOf HTML5Audio#
     * @default
     */
    audio: null,

    constructor: function(filename){
      this.audio = new Audio();
    },

    load: function(filename){
      this.name = filename;
      this.audio.pause();
      this.audio.preload = 'auto';
      this.audio.src = filename;
      on(this.audio, 'loadeddata', lang.hitch(this, function(e){
        this.complete = true;
      }));
    },

    loop: function(volume){
      var audio = this._initAudio(volume, true);
      on(audio, 'loadeddata', function(e){
        audio.play();
      });
    },

    play: function(volume, startTime){
      startTime = startTime || 0;

      var audio = this._initAudio(volume, false);
      on(audio, 'loadeddata', function(e){
        audio.currentTime = startTime / 1000;
        audio.play();
      });
    },

    _initAudio: function(volume, loop){
      loop = typeof loop === 'boolean' ? loop : false;

      var audio = new Audio();
      audio.pause();
      audio.volume = volume || 1;
      audio.loop = loop;
      audio.preload = 'auto';
      if(audio.mozLoadFrom){
        audio.mozLoadFrom(this.audio);
      } else {
        audio.src = this.name;
      }
      return audio;
    }
  });

});