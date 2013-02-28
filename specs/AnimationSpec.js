define([
  'frozen/Animation',
  'frozen/AnimFrame'
], function(Animation, AnimFrame){

  'use strict';

  describe('Animation', function(){
    var anim;

    beforeEach(function(){
      anim = new Animation();
    });

    it('should default to currFrameIndex of 0', function(){
      expect(anim.currFrameIndex).toBe(0);
    });

    it('should default to animTime of 0', function(){
      expect(anim.animTime).toBe(0);
    });

    it('should default to totalDuration of 0', function(){
      expect(anim.totalDuration).toBe(0);
    });

    it('should default to height of 64', function(){
      expect(anim.height).toBe(64);
    });

    it('should default to width of 64', function(){
      expect(anim.width).toBe(64);
    });

    it('should default to offsetX of 0', function(){
      expect(anim.offsetX).toBe(0);
    });

    it('should default to offsetY of 0', function(){
      expect(anim.offsetY).toBe(0);
    });

    it('should not have an image by default', function(){
      expect(anim.image).toBeNull();
    });

    // TODO: should these be split out into their own tests?
    it('should have functions defined', function(){
      expect(anim.constructor).toBeDefined();
      expect(anim.createFromSheet).toBeDefined();
      expect(anim.clone).toBeDefined();
      expect(anim.addFrame).toBeDefined();
      expect(anim.start).toBeDefined();
      expect(anim.update).toBeDefined();
      expect(anim.getCurrentFrame).toBeDefined();
      expect(anim.draw).toBeDefined();
    });

    describe('Animation.constructor()', function(){

      beforeEach(function(){
        spyOn(anim, 'constructor').andCallThrough();
        spyOn(anim, 'start');
      });

      it('should be call start', function(){
        anim.constructor();
        expect(anim.start).toHaveBeenCalled();
      });

    });

    describe('Animation.createFromSheet()', function(){
      var frameCount = 4;
      var frameTimes = [2,2,2,2];
      var img = new Image();
      var height = 64;
      var width = 64;
      var ySlot = 2;

      var anim2;

      beforeEach(function(){
        anim2 = anim.createFromSheet(frameCount, frameTimes, img, width, height, ySlot);
      });

      it('should not return the Animation it was called from', function(){
        expect(anim2 instanceof Animation).toBe(true);
        expect(anim2).not.toBe(anim);
      });

      it('should return an Animation with image, height, and width the same as passed in', function(){
        expect(anim2.image).toBe(img);
        expect(anim2.height).toBe(height);
        expect(anim2.width).toBe(width);
      });

      it('should have a frames array the length of frameCount defined', function(){
        expect(anim2.frames).toBeDefined();
        expect(Array.isArray(anim2.frames)).toBe(true);
        expect(anim2.frames.length).toBe(frameCount);
      });

    });

    describe('Animation.clone()', function(){
      var anim2;

      beforeEach(function(){
        anim2 = anim.clone();
      });

      it('should return a clone of the Animation called from', function(){
        expect(anim2).not.toBe(anim);
        expect(anim2).toEqual(anim);
      });

    });

    describe('Animation.addFrame()', function(){

      it('should add a frames array if none exists', function(){
        expect(anim.frames).toBeUndefined();

        anim.addFrame(2, 1, 1);

        expect(anim.frames).toBeDefined();
        expect(Array.isArray(anim.frames)).toBe(true);
        expect(anim.frames.length).toBe(1);
      });

      it('should increase totalDuration by duration passed in', function(){
        expect(anim.totalDuration).toBe(0);

        anim.addFrame(2, 1, 1);

        expect(anim.totalDuration).toBe(2);
      });

      it('should add a new AnimFrame on the frames array', function(){
        anim.addFrame(2, 1, 1);

        var frame = anim.frames[0];

        expect(frame instanceof AnimFrame).toBe(true);
        expect(frame.endTime).toBe(anim.totalDuration);
        expect(frame.image).toBe(anim.image);
        expect(frame.imgSlotX).toBe(1);
        expect(frame.imgSlotY).toBe(1);
      });

    });

    describe('Animation.start()', function(){

      it('should set animTime to 0', function(){
        expect(anim.animTime).toBe(0);

        anim.animTime = 2;

        expect(anim.animTime).toBe(2);

        anim.start();

        expect(anim.animTime).toBe(0);
      });

      it('should set currFrameIndex to 0', function(){
        expect(anim.currFrameIndex).toBe(0);

        anim.currFrameIndex = 2;

        expect(anim.currFrameIndex).toBe(2);

        anim.start();

        expect(anim.currFrameIndex).toBe(0);
      });

    });

    describe('Animation.update()', function(){

      beforeEach(function(){
        for(var x = 0; x < 5; x++){
          anim.addFrame(2, x, x);
        }
      });

      it('should not advance currFrameIndex if only 1 frame', function(){
        anim.frames.length = 1;

        expect(anim.frames.length).toBe(1);
        expect(anim.currFrameIndex).toBe(0);

        anim.update();

        expect(anim.currFrameIndex).toBe(0);
      });

      it('should increase the animTime by the elapsedTime passed', function(){
        expect(anim.animTime).toBe(0);

        anim.update(2);

        expect(anim.animTime).toBe(2);
      });

      it('should reset currFrameIndex to 0 when animTime exceeds totalDuration', function(){
        expect(anim.currFrameIndex).toBe(0);

        anim.update(3);

        expect(anim.currFrameIndex).toBe(1);

        anim.update(8);

        expect(anim.currFrameIndex).toBe(0);
      });

      it('should reset animTime to animTime modulus totalDuration when animTime exceeds totalDuration', function(){
        expect(anim.animTime).toBe(0);

        anim.update(3);

        expect(anim.animTime).toBe(3);

        anim.update(8);

        expect(anim.animTime).toBe(1);
      });

      it('should advance currFrameIndex until endTime is greater than animTime', function(){
        expect(anim.currFrameIndex).toBe(0);

        anim.update(3);

        expect(anim.currFrameIndex).toBe(1);

        anim.update(6);

        expect(anim.currFrameIndex).toBe(4);
      });

    });

    describe('Animation.getCurrentFrame()', function(){

      beforeEach(function(){
        for(var x = 0; x < 5; x++){
          anim.addFrame(2, x, x);
        }
      });

      it('should return null if there are no frames', function(){
        anim.frames.length = 0;

        expect(anim.getCurrentFrame()).toBe(null);
      });

      it('should return the current frame', function(){
        expect(anim.getCurrentFrame()).toBe(anim.frames[0]);

        anim.update(3);

        expect(anim.getCurrentFrame()).toBe(anim.frames[1]);

        anim.update(6);

        expect(anim.getCurrentFrame()).toBe(anim.frames[4]);
      });

    });

    describe('Animation.draw()', function(){
      var context;

      beforeEach(function(){
        for(var x = 0; x < 5; x++){
          anim.addFrame(2, x, x);
        }

        context = {
          drawImage: jasmine.createSpy('drawImage')
        };
      });

      it('should call drawImage on context with image clipping based on current frame', function(){
        var currentFrame = anim.getCurrentFrame();

        anim.draw(context, 2, 2);

        expect(context.drawImage).toHaveBeenCalled();
        expect(context.drawImage).toHaveBeenCalledWith(
          anim.image,
          currentFrame.imgSlotX * anim.width, currentFrame.imgSlotY * anim.height,
          anim.width, anim.height,
          2, 2,
          anim.width, anim.height
        );
      });
    });

  });
});