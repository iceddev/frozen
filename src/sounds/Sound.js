/**
 * An Audio object that implements a generic API
 * @name Sound
 * @constructor Sound
 */

define([
  'dcl'
], function(dcl){

  'use strict';

  return dcl(null, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf Sound#
     * @default
     */
    declaredClass: 'frozen/sounds/Sound',
    /**
     * The name of the Audio object - typically the filename
     * @type {String}
     * @memberOf Sound#
     * @default
     */
    name: null,
    /**
     * Signals if the Audio object has completed loading
     * @type {Boolean}
     * @memberOf Sound#
     * @default
     */
    complete: false,
    /**
     * Map of audio types and codecs used in fallback loading of sounds
     * Reference: https://developer.mozilla.org/en-US/docs/HTML/Supported_media_formats
     * @type {Object}
     * @memberOf Sound#
     * @property {String} mp3 'audio/mpeg'
     * @property {String} webm 'audio/webm'
     * @property {String} ogg 'audio/ogg'
     * @property {String} wav 'audio/wav'
     * @property {String} aac 'audio/aac'
     * @property {String} m4a 'audio/x-m4a'
     */
    formats: {
      'audio/mpeg': '.mp3',
      'audio/webm': '.webm',
      'audio/ogg': '.ogg',
      'audio/wav': '.wav',
      'audio/aac': '.aac',
      'audio/x-m4a': '.m4a'
    },
    /**
     * An array of extensions the browser "probably" can play
     * @type {Array}
     * @memberOf Sound#
     * @default
     */
    probably: null,
    /**
     * An array of extensions the browser "maybe" can play
     * @type {Array}
     * @memberOf Sound#
     * @default
     */
    maybe: null,

    constructor: function(filename){
      if(typeof filename === 'string'){
        this.load(filename);
      }

      // Initialize probably and maybe arrays
      if(!this.probably){
        this.probably = [];
      }

      if(!this.maybe){
        this.maybe = [];
      }
    },

    /**
     * Load the sound by filename
     * @function
     * @memberOf Sound#
     * @param  {String} filename The filename of the file to load
     */
    load: function(filename){
      this.name = filename;
      this.complete = true;
    },

    /**
     * Loop the sound at a certain volume
     * @function
     * @memberOf Sound#
     * @param  {Number} volume Value of volume - between 0 and 1
     */
    loop: function(volume){},

    /**
     * Play the sound at a certain volume and start time
     * @function
     * @memberOf Sound#
     * @param  {Number} volume    Value of volume - between 0 and 1
     * @param  {Number} startTime Value of milliseconds into the track to start
     */
    play: function(volume, startTime){},

    /**
     * Method used to construct Audio objects internally
     * @function
     * @memberOf Sound#
     * @private
     * @param  {Number} volume Value of volume - between 0 and 1
     * @param  {Boolean} loop Whether or not to loop audio
     * @return {Audio} Audio object that was constructed
     */
    _initAudio: function(volume, loop){},

    _chooseFormat: function(){
      if(!this.probably.length && !this.maybe.length){
        // Figure out the best extension if we have no cache
        var audio = new Audio();
        var codec;
        var result;
        for(codec in this.formats){
          result = audio.canPlayType(codec);
          if(result === 'probably'){
            this.probably.push(this.formats[codec]);
            continue;
          }

          if(result === 'maybe'){
            this.maybe.push(this.formats[codec]);
            continue;
          }
        }
      }

      if(this.probably.length){
        return this.probably[0];
      }

      if(this.maybe.length){
        return this.maybe[0];
      }

      return '';
    },

    _nextFormat: function(){
      if(this.probably.length > 1){
        this.probably.shift();
        return this.probably[0];
      }

      if(this.probably.length === 1){
        this.probably.length = 0;
        if(this.maybe.length){
          return this.maybe[0];
        }
      }

      if(this.maybe.length > 1){
        this.maybe.shift();
        return this.maybe[0];
      }

      if(this.maybe.length === 1){
        this.maybe.length = 0;
      }

      return '';
    }
  });

});