'use strict';

const Sound = require('../../sounds/Sound');
const has = require('../../has');
const expect = require('expect');


describe('Sound', function(){
  var sound;

  var formats = {
    'audio/mpeg': '.mp3',
    'audio/webm': '.webm',
    'audio/ogg': '.ogg',
    'audio/wav': '.wav',
    'audio/aac': '.aac',
    'audio/x-m4a': '.m4a'
  };

  var formats2 = {
    'audio/mpeg': '.mp3',
    'audio/webm': '.webm'
  };

  beforeEach(function(){
    sound = new Sound();
  });


  it('should default to name of null', function(){
    expect(sound.name).toBe(null);
  });

  it('should default to complete of false', function(){
    expect(sound.complete).toBe(false);
  });

  it('should have a set of default formats', function(){
    expect(sound.formats).toEqual(formats);
  });

  it.skip('should allow overriding the default formats', function(){
    Sound.prototype.formats = formats2;
    expect(sound.formats).toEqual(formats2);
    Sound.prototype.formats = formats;
  });

  it('should default to probably of empty array', function(){
    expect(sound.probably).toEqual([]);
  });

  it('should default to maybe of empty array', function(){
    expect(sound.maybe).toEqual([]);
  });

  it('should not share probably and maybe arrays', function(){
    var sound2 = new Sound();

    expect(sound.probably).toNotBe(sound2.probably);
    expect(sound.maybe).toNotBe(sound2.maybe);
  });

  // TODO: should these be split out into their own tests?
  it('should have functions defined', function(){
    expect(sound.constructor).toExist();
    expect(sound.load).toExist();
    expect(sound.loop).toExist();
    expect(sound.play).toExist();
    expect(sound._initAudio).toExist();
    expect(sound._chooseFormat).toExist();
    expect(sound._nextFormat).toExist();
  });

  describe('Sound.constructor()', function(){

    beforeEach(function(){
      spyOn(sound, 'load');
    });

    it('should call load with the filename passed to constructor', function(){
      sound.constructor('test/fixtures/yipee.wav');

      expect(sound.load).toHaveBeenCalled();
    });

    it('should not call load if a string is not passed to the constructor', function(){
      sound.constructor();

      expect(sound.load).not.toHaveBeenCalled();
    });

  });

  describe('Sound.load()', function(){
    var filename = 'test/fixtures/yipee.wav';

    beforeEach(function(){
      sound.load(filename);
    });

    it('should set sound.name to the filename passed in', function(){
      expect(sound.name).toBe(filename);
    });

    it('should set sound.complete to true', function(){
      expect(sound.complete).toBe(true);
    });

  });

  describe('Sound.loop()', function(){

    it('should implement loop as a function to be overridden', function(){
      expect(typeof sound.loop).toEqual('function');
    });

  });

  describe('Sound.play()', function(){

    it('should implement play as a function to be overridden', function(){
      expect(typeof sound.play).toEqual('function');
    });

  });

  describe('Sound._initAudio()', function(){

    it('should implement _initAudio as a function to be overridden', function(){
      expect(typeof sound._initAudio).toEqual('function');
    });

  });

  // No audio support in PhantomJS
  if(window.Audio){

    describe('Sound._chooseFormat()', function(){
      var format;

      beforeEach(function(){
        format = sound._chooseFormat();
      });

      it('should generate a cache of formats in probably and maybe arrays', function(){
        expect(sound.probably.length > 0 || sound.maybe.length > 0).toBe(true);
      });

      it('should return the best suited format', function(){
        expect(format).toNotBe('');
      });

      it('should return empty string if there are no suitable formats', function(){
        // Must wipe out the formats so cache isn't regenerated
        sound.formats = {};
        // Set lengths to 0 to wipe out cache
        sound.probably.length = 0;
        sound.maybe.length = 0;

        console.log('sound._chooseFormat()', typeof sound._chooseFormat());
        expect(sound._chooseFormat()).toEqual('');
      });

    });

    describe('Sound._nextFormat()', function(){
      var format1;
      var format2;
      var format3;

      beforeEach(function(){
        format1 = sound._chooseFormat();
        format2 = sound._nextFormat();
        format3 = sound._chooseFormat();
        console.log('formats', format1, format2, format3);
      });

      it('should return the next format in the cache', function(){
        expect(format2).toNotBe(format1);
        expect(format2).toBe(format3);
      });

      it('should return empty string if there are no suitable formats', function(){
        // Must wipe out the formats so cache isn't regenerated
        sound.formats = {};
        // Set lengths to 0 to wipe out cache
        sound.probably.length = 0;
        sound.maybe.length = 0;

        expect(sound._nextFormat()).toBe('');
      });

    });

  }

});
