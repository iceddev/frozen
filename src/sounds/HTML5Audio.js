/**
 * A Sound object that abstracts HTML5 Audio into a generic API that can also be used with WebAudio
 * @name HTML5Audio
 * @constructor HTML5Audio
 */

define([
  'dcl',
  'dojo/on',
  'dojo/_base/lang'
], function(dcl, on, lang){

  'use strict';

  return dcl(null, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf HTML5Audio#
     * @default
     */
    declaredClass: 'frozen/sounds/HTML5Audio',
    /**
     * The name of the Sound object - typically the filename
     * @type {String}
     * @memberOf HTML5Audio#
     * @default
     */
    name: null,
    /**
     * Signals if the Sound object has completed loading
     * @type {Boolean}
     * @memberOf HTML5Audio#
     * @default
     */
    complete: false,
    /**
     * The initial Audio object - used to load the sound prior to playing
     * @type {Audio}
     * @memberOf HTML5Audio#
     * @default
     */
    audio: null,

    constructor: function(filename){
      this.audio = new Audio();
      if(typeof filename === 'string'){
        this.load(filename);
      }
    },

    /**
     * Load the sound by filename
     * @function
     * @memberOf HTML5Audio#
     * @param  {String} filename The filename of the file to load
     */
    load: function(filename){
      this.name = filename;
      this.audio.pause();
      this.audio.preload = 'auto';
      this.audio.src = filename;
      on(this.audio, 'loadeddata', lang.hitch(this, function(e){
        this.complete = true;
      }));
    },

    /**
     * Loop the sound at a certain volume
     * @function
     * @memberOf HTML5Audio#
     * @param  {Number} volume Value of volume - between 0 and 1
     */
    loop: function(volume){
      var audio = this._initAudio(volume, true);
      on(audio, 'loadeddata', function(e){
        audio.play();
      });
    },

    /**
     * Play the sound at a certain volume and start time
     * @function
     * @memberOf HTML5Audio#
     * @param  {Number} volume    Value of volume - between 0 and 1
     * @param  {Number} startTime Value of milliseconds into the track to start
     */
    play: function(volume, startTime){
      startTime = startTime || 0;

      var audio = this._initAudio(volume, false);
      on(audio, 'loadeddata', function(e){
        audio.currentTime = startTime / 1000;
        audio.play();
      });
    },

    /**
     * Method used to construct Audio objects internally
     * @function
     * @memberOf HTML5Audio#
     * @private
     * @param  {Number} volume Value of volume - between 0 and 1
     * @param  {Boolean} loop Whether or not to loop audio
     * @return {Audio} Audio object that was constructed
     */
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