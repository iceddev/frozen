/**
 * The ResourceManager handles loading images and sounds for use in games.
 * @name ResourceManager
 * @constructor ResourceManager
 */

define([
  'require',
  './plugins/sound!',
  'dcl',
  'dcl/bases/Mixer',
  'lodash',
  'dojo/on'
], function(req, Sound, dcl, Mixer, _, on){

  'use strict';

  // TODO: move these to its own module for unit testing?
  function normalizePath(baseDir, path){
    var joinedPath = path;
    if(baseDir){
      joinedPath = [baseDir, path].join('/');
    }
    return joinedPath.replace(/\/{2,}/g, '/');
  }

  function flipX(image){
    var offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.height = image.height;
    offscreenCanvas.width = image.width;
    var ctx = offscreenCanvas.getContext('2d');

    ctx.translate(offscreenCanvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(image, 0, 0);
    return offscreenCanvas.toDataURL();
  }

  function flipY(image){
    var offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.height = image.height;
    offscreenCanvas.width = image.width;
    var ctx = offscreenCanvas.getContext('2d');

    ctx.translate(0, offscreenCanvas.height);
    ctx.scale(1, -1);
    ctx.drawImage(image, 0, 0);
    return offscreenCanvas.toDataURL();
  }

  var ImageWrapper = dcl(null, {
    name: '',
    img: null,
    complete: false,
    constructor: function(filename){
      var self = this;
      self.name = filename;
      self.img = new Image();
      on.once(self.img, 'load', function(){
        self.complete = true;
      });
    },
    load: function(){
      this.img.src = req.toUrl(this.name);
    }
  });

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
      if(typeof files !== 'object'){
        if(typeof files === 'string'){
          singleFile = true;
          files = [files];
        } else {
          return;
        }
      }

      var self = this;

      var fileList = _.transform(files, function(result, file, key){
        var filename = normalizePath(self.imageDir, file);

        //if we already have the image, just return it
        if(self.resourceList[filename]){
          return result[key] = self.resourceList[filename].img;
        }

        self.allLoaded = false;

        var wrapper = new ImageWrapper(filename);
        // Need to explicitly call load because flipImage also uses this object
        // which is probably a bad idea and should change in future
        // TODO: different objects for flipped image and regular image
        wrapper.load();
        self.resourceList[filename] = wrapper;
        result[key] = wrapper.img;
      });

      return singleFile ? fileList[0] : fileList;
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
      if(typeof files !== 'object'){
        if(typeof files === 'string'){
          singleFile = true;
          files = [files];
        } else {
          return;
        }
      }

      var self = this;

      var fileList = _.transform(files, function(result, file, key){
        var filename = normalizePath(self.soundDir, file);

        //if we already have the sound, just return it
        if(self.resourceList[filename]){
          return result[key] = self.resourceList[filename];
        }

        self.allLoaded = false;

        var sound = new Sound(filename);
        self.resourceList[filename] = sound;
        result[key] = sound;
      });

      return singleFile ? fileList[0] : fileList;
    },

    /**
     * Flips an image using the logic in a flip function passed and attaches to resource manager with name
     * @function
     * @memberOf ResourceManager#
     * @param  {String|Number} name Name for caching flipped image
     * @param  {Image} image Image to be flipped
     * @param  {Function} flipFn Function containing logic to flip image
     * @return {Image} Flipped image
     */
    flipImage: function(name, image, flipFn){
      this.allLoaded = false;

      var wrapper = new ImageWrapper(name);
      this.resourceList[name] = wrapper;

      on.once(image, 'load', function(){
        wrapper.img.src = flipFn(image);
      });

      _.any(this.resourceList, function(resource){
        if(resource.img === image && resource.complete){
          wrapper.img.src = flipFn(image);
          return true;
        }
      });

      return wrapper.img;
    },

    /**
     * Flip image along x-axis using default flip logic
     * @function
     * @memberOf ResourceManager#
     * @param  {String|Number} name Name for caching flipped image
     * @param  {Image} image Image to be flipped
     * @return {Image} Flipped image
     */
    flipImageX: function(name, image){
      return this.flipImage(name, image, flipX);
    },

    /**
     * Flip image along the y-axis using default flip logic
     * @function
     * @memberOf ResourceManager#
     * @param  {String|Number} name Name for caching flipped image
     * @param  {Image} image Image to be flipped
     * @return {Image} Flipped image
     */
    flipImageY: function(name, image){
      return this.flipImage(name, image, flipY);
    },

    /**
     * Checks whether the resources have finished loading
     * @function
     * @memberOf ResourceManager#
     */
    resourcesReady: function(){
      if(this.allLoaded){
        return true;
      } else {
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
      } else {
        return Math.round((numComplete / length) * 100.0);
      }
    }
  });

});
