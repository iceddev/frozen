'use strict';

const ResourceManager = require('../ResourceManager');
const Sound = require('../sounds/Sound');
const expect = require('expect');


describe.skip('ResourceManager', function(){
  var rm;

  beforeEach(function(){
    rm = new ResourceManager();
    console.log('new rm', rm.getPercentComplete);
  });

  afterEach(function(){
    for(var res in rm.resourceList){
      delete rm.resourceList[res];
    }
  });

  it('should default to allLoaded as false', function(){
    expect(rm.allLoaded).toBe(false);
  });

  it('should not have an imageDir as default', function(){
    expect(rm.imageDir).toBe(null);
  });

  it('should not have a soundDir as default', function(){
    expect(rm.soundDir).toBe(null);
  });

  // TODO: deal with async issues and shared resourceList
  it('should have an empty resourceList as default', function(){
    expect(rm.resourceList).toEqual({});
  });

  // TODO: should these be split out into their own tests?
  it('should have functions defined', function(){
    expect(rm.loadImage).toExist();
    expect(rm.loadSound).toExist();
    expect(rm.flipImage).toExist();
    expect(rm.flipImageX).toExist();
    expect(rm.flipImageY).toExist();
    expect(rm.resourcesReady).toExist();
    expect(rm.getPercentComplete).toExist();
  });

  it('should share the resourceList between ResourceManager instances', function(){
    var rm2 = new ResourceManager();

    expect(rm.resourceList).toEqual(rm2.resourceList);
  });

  describe('ResourceManager.loadImage()', function(){
    var image;

    beforeEach(function(){
      image = rm.loadImage('test/fixtures/luis_gangnam.jpg');
    });

    it('should take a string filename and return a single image', function(){
      var origin = window.location.toString().replace(window.location.pathname, '');
      expect(image instanceof Image).toBe(true);
      expect(image.src).toEqual(origin + '/test/fixtures/luis_gangnam.jpg');
    });

    it('should take an array of filenames and return an array of images', function(){
      var filenames = [
        'test/fixtures/luis_gangnam.jpg',
        'test/fixtures/luis_gangnam.jpg',
        'test/fixtures/luis_gangnam.jpg'
      ];
      var images = rm.loadImage(filenames);

      expect(Array.isArray(images)).toBe(true);
      expect(images.length).toBe(3);
      images.forEach(function(image){
        expect(image instanceof Image).toBe(true);
      });
    });

    it('should take an object of filenames and return an object of images mapped to the same keys', function(){
      var filenames = {
        file1: 'test/fixtures/luis_gangnam.jpg',
        file2: 'test/fixtures/luis_gangnam.jpg',
        file3: 'test/fixtures/luis_gangnam.jpg'
      };
      var images = rm.loadImage(filenames);

      expect(images).toExist();
      expect(images).toNotBe(null);
      Object.keys(filenames).forEach(function(filename){
        expect(Object.keys(images)).toContain(filename);
      });
      for(var key in images){
        var image = images[key];
        expect(image instanceof Image).toBe(true);
      }
    });

    it('should mark allLoaded as false when called', function(){
      expect(rm.allLoaded).toBe(false);

      rm.allLoaded = true;
      rm.resourceList = {};

      expect(rm.allLoaded).toBe(true);

      var image = rm.loadImage('test/fixtures/luis_gangnam.jpg');

      expect(rm.allLoaded).toBe(false);
    });

    it('should not mark allLoaded as false when called but resource is already cached', function(){
      expect(rm.allLoaded).toBe(false);

      rm.allLoaded = true;

      expect(rm.allLoaded).toBe(true);

      var image = rm.loadImage('test/fixtures/luis_gangnam.jpg');

      expect(rm.allLoaded).toBe(true);
    });

    it('should add the image into resourceList', function(){
      expect(rm.resourceList['test/fixtures/luis_gangnam.jpg']).toExist();
      expect(rm.resourceList['test/fixtures/luis_gangnam.jpg'].img).toBe(image);
    });

    it.skip('should mark image as complete when finished loading', function(){
      waitsFor(function(){
        return rm.resourceList['test/fixtures/luis_gangnam.jpg'].complete;
      }, 'should have complete downloading and flagged as complete', 500); // TODO: might need to change timeout if image loads slow
    });

  });

  // Only use these tests in browsers, PhantomJS blows up due to no HTML5 Audio support
  describe('ResourceManager.loadSound()', function(){
    var sound;

    beforeEach(function(){
      sound = rm.loadSound('test/fixtures/yipee.wav');
    });

    it('should take a string filename and return a single sound', function(){
      var origin = window.location.toString().replace(window.location.pathname, '');
      expect(dcl.isInstanceOf(sound, Sound)).toBe(true);
    });

    it('should take an array of filenames and return an array of sounds', function(){
      var filenames = [
        'test/fixtures/yipee.wav',
        'test/fixtures/yipee.wav',
        'test/fixtures/yipee.wav'
      ];
      var sounds = rm.loadSound(filenames);

      expect(Array.isArray(sounds)).toBe(true);
      expect(sounds.length).toBe(3);
      sounds.forEach(function(sound){
        expect(dcl.isInstanceOf(sound, Sound)).toBe(true);
      });
    });

    it('should take an object of filenames and return an object of sounds mapped to the same keys', function(){
      var filenames = {
        file1: 'test/fixtures/yipee.wav',
        file2: 'test/fixtures/yipee.wav',
        file3: 'test/fixtures/yipee.wav'
      };
      var sounds = rm.loadSound(filenames);

      expect(sounds).toExist();
      expect(sounds).toNotBe(null);
      Object.keys(filenames).forEach(function(filename){
        expect(Object.keys(sounds)).toContain(filename);
      });
      for(var key in sounds){
        var sound = sounds[key];
        expect(dcl.isInstanceOf(sound, Sound)).toBe(true);
      }
    });

    it('should mark allLoaded as false when called', function(){
      expect(rm.allLoaded).toBe(false);

      rm.allLoaded = true;
      rm.resourceList = {};

      expect(rm.allLoaded).toBe(true);

      var sound = rm.loadSound('test/fixtures/yipee.wav');

      expect(rm.allLoaded).toBe(false);
    });

    it('should not mark allLoaded as false when called but resource is already cached', function(){
      expect(rm.allLoaded).toBe(false);

      rm.allLoaded = true;

      expect(rm.allLoaded).toBe(true);

      var sound = rm.loadSound('test/fixtures/yipee.wav');

      expect(rm.allLoaded).toBe(true);
    });

    it('should add the sound into resourceList', function(){
      expect(rm.resourceList['test/fixtures/yipee.wav']).toExist();
    });

    it('should mark sound as complete when finished loading', function(){
      waitsFor(function(){
        return rm.resourceList['test/fixtures/yipee.wav'].complete;
      }, 'should have complete downloading and flagged as complete', 500); // TODO: might need to change timeout if image loads slow
    });

  });

  describe('ResourceManager.flipImage()', function(){
    var image;
    var imgUrl = 'test/fixtures/flipXY.png';
    var canvas;
    var ctx;
    var flipped;

    function customFlip(image){
      var offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.height = image.height;
      offscreenCanvas.width = image.width;
      var ctx = offscreenCanvas.getContext('2d');

      ctx.translate(offscreenCanvas.width, offscreenCanvas.height);
      ctx.scale(-1, -1);
      ctx.drawImage(image, 0, 0);
      return offscreenCanvas.toDataURL();
    }

    beforeEach(function(){
      image = rm.loadImage(imgUrl);
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      flipped = rm.flipImage('flippedXY', image, customFlip);
    });

    afterEach(function(){
      canvas = null;
    });

    it('should cache the flipped image in the resourceList with the named passed in', function(){
      expect(rm.resourceList.flippedXY).toExist();
    });

    it('should mark the flipped image as complete when finished flipping', function(){
      waitsFor(function(){
        return rm.resourceList.flippedXY.complete;
      }, 'should have flipped the image', 500);
    });

    it('should take a custom function and return the flipped image', function(){
      waitsFor(function(){
        return rm.resourceList.flippedXY.complete;
      }, 'should have flipped the image', 500);

      runs(function(){
        ctx.drawImage(flipped, 0, 0);
        var pixel = ctx.getImageData(0, 0, 1, 1);
        var r = pixel.data[0];
        var g = pixel.data[1];
        var b = pixel.data[2];
        var a = pixel.data[3];
        expect(r).toBe(0);
        expect(g).toBe(0);
        expect(b).toBe(0);
        expect(a).toBe(255);
      });
    });
  });

  describe('ResourceManager.flipImageX()', function(){
    var image;
    var imgUrl = 'test/fixtures/flipX.png';
    var canvas;
    var ctx;
    var flipped;

    beforeEach(function(){
      image = rm.loadImage(imgUrl);
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      flipped = rm.flipImageX('flippedX', image);
    });

    afterEach(function(){
      canvas = null;
    });

    it('should cache the flipped image in the resourceList with the named passed in', function(){
      expect(rm.resourceList.flippedX).toExist();
    });

    it('should mark the flipped image as complete when finished flipping', function(){
      waitsFor(function(){
        return rm.resourceList.flippedX.complete;
      }, 'should have flipped the image', 500);
    });

    it('should take a custom function and return the flipped image', function(){
      waitsFor(function(){
        return rm.resourceList.flippedX.complete;
      }, 'should have flipped the image', 500);

      runs(function(){
        ctx.drawImage(flipped, 0, 0);
        var pixel = ctx.getImageData(0, 0, 1, 1);
        var r = pixel.data[0];
        var g = pixel.data[1];
        var b = pixel.data[2];
        var a = pixel.data[3];
        expect(r).toBe(0);
        expect(g).toBe(0);
        expect(b).toBe(0);
        expect(a).toBe(255);
      });
    });
  });

  describe('ResourceManager.flipImageY()', function(){
    var image;
    var imgUrl = 'test/fixtures/flipY.png';
    var canvas;
    var ctx;
    var flipped;

    beforeEach(function(){
      image = rm.loadImage(imgUrl);
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      flipped = rm.flipImageY('flippedY', image);
    });

    afterEach(function(){
      canvas = null;
    });

    it('should cache the flipped image in the resourceList with the named passed in', function(){
      expect(rm.resourceList.flippedY).toExist();
    });

    it('should mark the flipped image as complete when finished flipping', function(){
      waitsFor(function(){
        return rm.resourceList.flippedY.complete;
      }, 'should have flipped the image', 500);
    });

    it('should take a custom function and return the flipped image', function(){
      waitsFor(function(){
        return rm.resourceList.flippedY.complete;
      }, 'should have flipped the image', 500);

      runs(function(){
        ctx.drawImage(flipped, 0, 0);
        var pixel = ctx.getImageData(0, 0, 1, 1);
        var r = pixel.data[0];
        var g = pixel.data[1];
        var b = pixel.data[2];
        var a = pixel.data[3];
        expect(r).toBe(0);
        expect(g).toBe(0);
        expect(b).toBe(0);
        expect(a).toBe(255);
      });
    });
  });

  describe('ResourceManager.resourcesReady()', function(){

    it('should return true if no resources are loaded', function(){
      var ready = rm.resourcesReady();

      expect(ready).toBe(true);
    });

    it('should return false if a resource is not complete', function(){
      rm.resourceList.mock = {
        complete: false
      };

      var ready = rm.resourcesReady();

      expect(ready).toBe(false);

      rm.resourceList.mock.complete = true;
    });

    it('should return true if all resources are complete', function(){
      rm.resourceList.mock = {
        complete: true
      };

      var ready = rm.resourcesReady();

      expect(ready).toBe(true);
    });

  });

  describe('ResourceManager.getPercentComplete()', function(){

    it('should return the percent of complete resources', function(){
      rm.resourceList = {
        mock: {
          complete: true
        },
        mock2: {
          complete: false
        }
      };

      var percent = rm.getPercentComplete();

      expect(percent).toEqual(50);
    });

    it('should return 0 if no resources exist in cache', function(){
      rm.resourceList = {};

      var percent = rm.getPercentComplete();

      expect(percent).toEqual(0);
    });

  });

});

