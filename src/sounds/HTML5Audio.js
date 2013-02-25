/**
 * An Audio object that implements HTML5 Audio into a generic API
 * @name HTML5Audio
 * @constructor HTML5Audio
 * @extends AudioBase
 */

define([
  './AudioBase',
  'dcl',
  'dojo/on',
  'dojo/has',
  'dojo/_base/lang'
], function(AudioBase, dcl, on, has, lang){

  'use strict';

  has.add('HTML5Audio', function(global){
    return !!global.Audio;
  });

  has.add('shittySound', (has('ios') || has('android')) && has('webkit'));

  return dcl(AudioBase, {
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
      }

      this.audio.pause();
      this.audio.preload = 'auto';
      this.audio.src = filename;
      on.once(this.audio, 'loadeddata', lang.hitch(this, function(e){
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

      if(has('shittySound')){
        this.audio.currentTime = startTime / 1000;
        return this.audio.play();
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