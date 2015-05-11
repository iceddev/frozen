/**
 * An Audio object that implements a generic API
 * @name Sound
 * @constructor Sound
 */

'use strict';

const _ = require('lodash');

/**
 * Map of audio types and codecs used in fallback loading of sounds <br>
 * Reference: https://developer.mozilla.org/en-US/docs/HTML/Supported_media_formats
 * @type {Object}
 * @memberOf Sound#
 * @property {String} 'audio/mpeg' '.mp3'
 * @property {String} 'audio/webm' '.webm'
 * @property {String} 'audio/ogg' '.ogg'
 * @property {String} 'audio/wav' '.wav'
 * @property {String} 'audio/aac' '.aac'
 * @property {String} 'audio/x-m4a' '.m4a'
 * @example
 * // To override the default formats:
 * // Do this before loading any sounds
 * require([
 *   'frozen/sounds/Sound'
 * ], function(Sound){
 *   Sound.prototype.formats = {
 *     'audio/mpeg': '.mp3',
 *     'audio/webm': '.webm'
 *   };
 * });
 */
const formats = {
  'audio/mpeg': '.mp3',
  'audio/webm': '.webm',
  'audio/ogg': '.ogg',
  'audio/wav': '.wav',
  'audio/aac': '.aac',
  'audio/x-m4a': '.m4a'
};


//TODO need replacement for has
// has.add('shittySound', function(){
//   return !!((has('android') || has('ios')) && has('webkit'));
// });


class Sound {
  constructor(options){
    options = options || {};

    /**
     * The name of the Audio object - typically the filename
     * @type {String}
     * @memberOf Sound#
     * @default
     */
    this.name = null;

    /**
     * Signals if the Audio object has completed loading
     * @type {Boolean}
     * @memberOf Sound#
     * @default
     */
    this.complete = false;

    /**
     * An array of extensions the browser "probably" can play
     * @type {Array}
     * @memberOf Sound#
     * @default
     */
    this.probably = [];

    /**
     * An array of extensions the browser "maybe" can play
     * @type {Array}
     * @memberOf Sound#
     * @default
     */
    this.maybe = [];

    _.assign(this, options);

    if(typeof options === 'string'){
      this.load(options);
    }
  }

  /**
   * Load the sound by filename
   * @function
   * @memberOf Sound#
   * @param  {String} filename The filename of the file to load
   */
  load(filename){
    this.name = filename;
    this.complete = true;
  }

  /**
   * Loop the sound at a certain volume
   * @function
   * @memberOf Sound#
   * @param  {Number} volume Value of volume - between 0 and 1
   */
  loop(volume){}

  /**
   * Play the sound at a certain volume and start time
   * @function
   * @memberOf Sound#
   * @param  {Number} volume    Value of volume - between 0 and 1
   * @param  {Number} startTime Value of milliseconds into the track to start
   */
  play(volume, startTime){}

  /**
   * Method used to construct Audio objects internally
   * @function
   * @memberOf Sound#
   * @private
   * @param  {Number} volume Value of volume - between 0 and 1
   * @param  {Boolean} loop Whether or not to loop audio
   * @return {Audio} Audio object that was constructed
   */
  _initAudio(volume, loop){}

  /**
   * Method used to generate a cache of extensions (probably/maybe arrays) to try loading
   * @function
   * @memberOf Sound#
   * @private
   * @return {String} First extension to try loading
   */
  _chooseFormat(){
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
  }

  /**
   * Method used to remove a extension that didn't work and return the next viable extension
   * @function
   * @memberOf Sound#
   * @private
   * @return {String} Next extension to try loading
   */
  _nextFormat(){
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

}

module.exports = Sound;
