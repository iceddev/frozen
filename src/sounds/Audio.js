/**
 * An Audio object that implements a generic API
 * @name Audio
 * @constructor Audio
 */

define([
  'dcl',
  'dcl/bases/Mixer'
], function(dcl, Mixer){

  'use strict';

  return dcl(Mixer, {
    /**
     * The declared class - used for debugging in dcl
     * @type {String}
     * @memberOf Audio#
     * @default
     */
    declaredClass: 'frozen/sounds/Audio',
    /**
     * The name of the Audio object - typically the filename
     * @type {String}
     * @memberOf Audio#
     * @default
     */
    name: null,
    /**
     * Signals if the Audio object has completed loading
     * @type {Boolean}
     * @memberOf Audio#
     * @default
     */
    complete: false,

    constructor: function(filename){
      if(typeof filename === 'string'){
        this.load(filename);
      }
    },

    /**
     * Load the sound by filename
     * @function
     * @memberOf Audio#
     * @param  {String} filename The filename of the file to load
     */
    load: function(filename){
      this.name = filename;
      this.complete = true;
    },

    /**
     * Loop the sound at a certain volume
     * @function
     * @memberOf Audio#
     * @param  {Number} volume Value of volume - between 0 and 1
     */
    loop: function(volume){},

    /**
     * Play the sound at a certain volume and start time
     * @function
     * @memberOf Audio#
     * @param  {Number} volume    Value of volume - between 0 and 1
     * @param  {Number} startTime Value of milliseconds into the track to start
     */
    play: function(volume, startTime){},

    /**
     * Method used to construct Audio objects internally
     * @function
     * @memberOf Audio#
     * @private
     * @param  {Number} volume Value of volume - between 0 and 1
     * @param  {Boolean} loop Whether or not to loop audio
     * @return {Audio} Audio object that was constructed
     */
    _initAudio: function(volume, loop){}
  });

});