define([
  'frozen/sounds/WebAudio',
  'frozen/sounds/Sound',
  'dcl',
  'dojo/has'
], function(WebAudio, Sound, dcl, has){

  'use strict';

  describe('WebAudio', function(){

    it('should add a has test for WebAudio', function(){
      expect(has('WebAudio')).toBeDefined();
    });

  });

  if(has('WebAudio')){
    describe('WebAudio', function(){
      var sound;
      var filename = 'specs/fixtures/yipee.wav';
      var filename2 = 'specs/fixtures/yipee';
      var noteOn = jasmine.createSpy('noteOn');

      beforeEach(function(){
        sound = new WebAudio();
      });

      it('should inherit from Sound', function(){
        expect(dcl.isInstanceOf(sound, Sound)).toBe(true);
      });

      it('should receive an instance of AudioContext as audioContext', function(){
        expect(sound.audioContext instanceof window.AudioContext).toBe(true);
      });

      it('should default to a buffer of null', function(){
        expect(sound.buffer).toBeNull();
      });

      describe('WebAudio.load()', function(){

        it('should set the name to the filename passed in', function(){
          sound.load(filename);
          expect(sound.name).toBe(filename);
        });

        it('should add an extension if one is not specified on filename passed in', function(){
          spyOn(sound, '_chooseFormat').andCallThrough();

          sound.load(filename2);
          expect(sound._chooseFormat).toHaveBeenCalled();
        });

        it('should try another extension if one is not specified on filename passed in and the first one fails', function(){
          var flag = false;
          spyOn(sound, '_chooseFormat').andReturn('');
          spyOn(sound, '_nextFormat').andCallFake(function(){
            flag = true;
          });

          runs(function(){
            sound.load(filename2);
          });

          waitsFor(function(){
            return flag;
          }, '_nextFormat should have been called', 500);

          runs(function(){
            expect(sound._nextFormat).toHaveBeenCalled();
          });
        });

        it('should set complete to true if all extensions fail', function(){
          spyOn(sound, '_chooseFormat').andCallThrough();
          spyOn(sound, '_nextFormat').andCallThrough();

          sound.formats = {};
          sound.probably.length = 0;
          sound.maybe.length = 0;

          runs(function(){
            sound.load(filename2);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 500);

          runs(function(){
            expect(sound.complete).toBe(true);
          });
        });

        it('should call decodeAudioData when the AJAX call returns', function(){
          var flag = false;
          spyOn(sound.audioContext, 'decodeAudioData').andCallFake(function(){
            flag = true;
          });

          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return flag;
          }, 'decodeAudioData should have been called', 500);

          runs(function(){
            expect(sound.audioContext.decodeAudioData).toHaveBeenCalled();
            expect(sound.audioContext.decodeAudioData.mostRecentCall.args.length).toBe(3);
          });
        });

        it('should set the buffer when sound is decoded', function(){
          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return sound.buffer;
          }, 'buffer should have been set', 500);

          runs(function(){
            expect(sound.buffer).toBeDefined();
          });
        });

        it('should mark the sound as complete when done decoding', function(){
          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 500);

          runs(function(){
            expect(sound.complete).toBe(true);
          });
        });

      });

      describe('WebAudio.loop()', function(){

        beforeEach(function(){
          spyOn(sound, '_initAudio').andReturn({
            noteOn: noteOn
          });

          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 500);
        });

        it('should return undefined if a buffer is not set', function(){
          runs(function(){
            sound.buffer = null;
            sound.loop();
            expect(sound._initAudio).not.toHaveBeenCalled();
          });
        });

        it('should initialize a new source if buffer is set', function(){
          runs(function(){
            sound.loop();
            expect(sound._initAudio).toHaveBeenCalled();
            expect(sound._initAudio).toHaveBeenCalledWith(undefined, true);
          });
        });

        it('should initialize the new source with volume passed in', function(){
          runs(function(){
            sound.loop(1);
            expect(sound._initAudio).toHaveBeenCalled();
            expect(sound._initAudio).toHaveBeenCalledWith(1, true);
          });
        });

        it('should call noteOn with startTime of 0', function(){
          runs(function(){
            sound.loop();
            expect(noteOn).toHaveBeenCalled();
            expect(noteOn).toHaveBeenCalledWith(0);
          });
        });

      });

      describe('WebAudio.play()', function(){

        beforeEach(function(){
          spyOn(sound, '_initAudio').andReturn({
            noteOn: noteOn
          });

          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 500);
        });

        it('should return undefined if a buffer is not set', function(){
          runs(function(){
            sound.buffer = null;
            sound.play();
            expect(sound._initAudio).not.toHaveBeenCalled();
          });
        });

        it('should initialize a new source if buffer is set', function(){
          runs(function(){
            sound.play();
            expect(sound._initAudio).toHaveBeenCalled();
            expect(sound._initAudio).toHaveBeenCalledWith(undefined, false);
          });
        });

        it('should initialize the new source with volume passed in', function(){
          runs(function(){
            sound.play(1);
            expect(sound._initAudio).toHaveBeenCalled();
            expect(sound._initAudio).toHaveBeenCalledWith(1, false);
          });
        });

        it('should call noteOn with startTime of 0 if startTime not passed in', function(){
          runs(function(){
            sound.play();
            expect(noteOn).toHaveBeenCalled();
            expect(noteOn).toHaveBeenCalledWith(0);
          });
        });

        it('should call noteOn with startTime passed in', function(){
          runs(function(){
            sound.play(1, 100);
            expect(noteOn).toHaveBeenCalled();
            expect(noteOn).toHaveBeenCalledWith(100);
          });
        });

      });

      describe('WebAudio._initAudio()', function(){

        beforeEach(function(){
          runs(function(){
            sound.load(filename);
          });

          waitsFor(function(){
            return sound.complete;
          }, 'sound should have been marked as complete', 500);
        });

        it('should return a source', function(){
          runs(function(){
            expect(sound._initAudio()).toBeDefined();
          });
        });

        it('should attach the buffer to the source.buffer', function(){
          runs(function(){
            expect(sound._initAudio().buffer).toBe(sound.buffer);
          });
        });

        it('should set source.loop to the value of loop passed in, defaulting to false', function(){
          runs(function(){
            expect(sound._initAudio().loop).toBe(false);
            expect(sound._initAudio(null, true).loop).toBe(true);
            expect(sound._initAudio(null, false).loop).toBe(false);
          });
        });

        // TODO: find a way to test the gainNode value being set to volume
      });

    });
  }

});