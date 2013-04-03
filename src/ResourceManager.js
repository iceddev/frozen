/**
 * The ResourceManager handles loading images and sounds for use in games.
 * @name ResourceManager
 * @constructor ResourceManager
 */

define([
  './plugins/sound!',
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  'dojo/on'
], function(Sound, dcl, Mixer, lang, on){

  'use strict';

  // TODO: move this to its own module for unit testing?
  function normalizePath(baseDir, path){
    var joinedPath = path;
    if(baseDir){
      joinedPath = [baseDir, path].join('/');
    }
    return joinedPath.replace(/\/{2,}/g, '/');
  }

  return dcl(Mixer, {
    /**
     * Whether all the resources have been loaded
     * @type {Boolean}
     * @memberOf ResourceManager#
     * @default
     */
    allLoaded: false,
    /**
     * The base directory to load images from
     * @type {String}
     * @memberOf ResourceManager#
     * @default
     */
    imageDir: null,
    /**
     * The base directory to load sounds from
     * @type {String}
     * @memberOf ResourceManager#
     * @default
     */
    soundDir: null,
    /**
     * A map of all the resources by their URLs
     * @type {Object}
     * @memberOf ResourceManager#
     * @default
     */
    resourceList: {},

    /**
     * Loads an image (or a collection of images), and tracks if it has finished loading
     * @function
     * @memberOf ResourceManager#
     * @param {String|Array|Object} files Filename of the image relative the Game's HTML page.
     * @returns {Image|Array|Object} Return type based on argument: Image if String, Array of Images if Array, or Object of key-Image pairs if Object
     */
    loadImage: function(files){
      var singleFile = false;
      // Normalize arguments
      if(!Array.isArray(files)){
        if(typeof files === 'string'){
          singleFile = true;
          files = [files];
        } else if(typeof files !== 'object'){
          return;
        }
      }

      for(var key in files){
        if(!files.hasOwnProperty(key)){
          continue;
        }
        var filename = normalizePath(this.imageDir, files[key]);

        //if we already have the image, just return it
        if(this.resourceList[filename]){
          files[key] = this.resourceList[filename].img;
          continue;
        }

        this.allLoaded = false;

        var img = new Image();
        var imgWrapper = {
          name: filename,
          img: img,
          complete: false
        };

        var imageComplete = lang.partial(function(imgWrapper, evt){
          imgWrapper.complete = true;
        }, imgWrapper);
        on(img, 'load', imageComplete);
        img.src = filename;

        this.resourceList[filename] = imgWrapper;
        files[key] = img;
      }

      return singleFile ? files[0] : files;
    },

    /**
     * Loads a sound file (or a collection of sound files), and tracks if it has finished loading
     * @function
     * @memberOf ResourceManager#
     * @param {String|Array|Object} filename Filename of the sound relative the Game's HTML page.
     * @returns {Sound|Array|Object} Return type based on argument: Sound Object if String, Array of Sound Objects if Array, or Object of key-Sound Object pairs if Object
     */
    loadSound: function(files){
      var singleFile = false;
      // Normalize arguments
      if(!Array.isArray(files)){
        if(typeof files === 'string'){
          singleFile = true;
          files = [files];
        } else if(typeof files !== 'object'){
          return;
        }
      }

      for(var key in files){
        if(!files.hasOwnProperty(key)){
          continue;
        }
        var filename = normalizePath(this.soundDir, files[key]);

        //if we already have the sound, just return it
        if(this.resourceList[filename]){
          files[key] = this.resourceList[filename];
          continue;
        }

        this.allLoaded = false;

        var sound = new Sound(filename);
        this.resourceList[filename] = sound;

        files[key] = sound;
      }
      return singleFile ? files[0] : files;
    },

    /**
     * Checks whether the resources have finished loading
     * @function
     * @memberOf ResourceManager#
     */
    resourcesReady: function(){
      if(this.allLoaded){
        return true;
      }else{
        for(var filename in this.resourceList){
          var resource = this.resourceList[filename];
          if(!resource.complete){
            return false;
          }
        }
        this.allLoaded = true;
        return true;
      }
    },

    /**
     * Gets the percent of resources loaded.
     * @function
     * @memberOf ResourceManager#
     * @return {Number} The percent of resources loaded
     */
    getPercentComplete: function(){
      var numComplete = 0.0;
      var length = 0;
      for(var filename in this.resourceList){
        var resource = this.resourceList[filename];
        length++;
        if(resource.complete){
          numComplete = numComplete + 1.0;
        }
      }
      if(length === 0){
        return 0;
      }else{
        return Math.round((numComplete / length) * 100.0);
      }
    }
  });

});
