/**
 * An Audio object that implements HTML5 Audio into a generic API
 * @name HTML5Audio
 * @constructor HTML5Audio
 * @extends Sound
 */

define([
  './Sound',
  'dcl',
  'dojo/on',
  'dojo/has',
  'dojo/_base/lang'
], function(Sound, dcl, on, has, lang){

  'use strict';

  has.add('HTML5Audio', function(global){
    return !!global.Audio;
  });

  has.add('shittySound', (has('ios') || has('android')) && has('webkit'));

  return dcl(Sound, {
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

    load: function(filename){
      this.name = filename;

      this.audio = new Audio();
      if(has('shittySound')){
        on.once(document, 'touchstart', lang.hitch(this, function(e){
          this.audio.load();
        }));
        this._updateCurrentTime = null;
        on.once(this.audio, 'progress', lang.hitch(this, function(){
          if(this._updateCurrentTime !== null){
            this._updateCurrentTime();
          }
        }));
      }

      this.audio.pause();
      this.audio.preload = 'auto';
      on.once(this.audio, 'loadeddata, error', lang.hitch(this, function(e){
        this.complete = true;
      }));
      this.audio.src = filename;
    },

    loop: function(volume){
      var audio = this._initAudio(volume, true);
      on(audio, 'loadeddata', function(e){
        audio.play();
      });
    },

    play: function(volume, startTime){
      startTime = startTime || 0;

      if(has('shittySound')){
        try {
          this.audio.currentTime = startTime / 1000;
          return this.audio.play();
        } catch(err){
          this._updateCurrentTime = function(){
            this._updateCurrentTime = null;
            this.audio.currentTime = startTime / 1000;
            return this.audio.play();
          };
          return this.audio.play();
        }
      }

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