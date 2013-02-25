define([
  'dcl',
  'frozen/plugins/loadSound!specs/fixtures/yipee.wav',
  'frozen/plugins/loadSound![specs/fixtures/yipee.wav,specs/fixtures/yipee.wav,specs/fixtures/yipee.wav]',
  'frozen/plugins/loadSound!{sound1:specs/fixtures/yipee.wav,sound2:specs/fixtures/yipee.wav,sound3:specs/fixtures/yipee.wav}',
  'frozen/sounds/AudioBase'
], function(dcl, singleSound, soundArray, soundObject, AudioBase){

  'use strict';

  describe('plugins/loadSound', function(){

    it('should load a single sound', function(){
      expect(dcl.isInstanceOf(singleSound, AudioBase)).toBe(true);
    });

    it('should load an array of sounds', function(){
      expect(Array.isArray(soundArray)).toBe(true);
      expect(soundArray.length).toBe(3);
      soundArray.forEach(function(sound){
        expect(dcl.isInstanceOf(sound, AudioBase)).toBe(true);
      });
    });

    it('should load an object of sounds', function(){
      expect(Array.isArray(soundObject)).toBe(false);
      expect(typeof soundObject).toBe('object');
      Object.keys(soundObject).forEach(function(key){
        expect(['sound1', 'sound2', 'sound3']).toContain(key);
      });
    });

  });

});