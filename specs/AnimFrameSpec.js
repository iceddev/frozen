define([
  'frozen/AnimFrame'
], function(AnimFrame){

  'use strict';

  describe('AnimFrame', function(){
    var frame;

    beforeEach(function(){
      frame = new AnimFrame();
    });

    it('should default to endTime of 0', function(){
      expect(frame.endTime).toBe(0);
    });

    it('should default to imgSlotX of 0', function(){
      expect(frame.imgSlotX).toBe(0);
    });

    it('should default to imgSlotY of 0', function(){
      expect(frame.imgSlotY).toBe(0);
    });

    it('should not have an image by default', function(){
      expect(frame.image).toBeNull();
    });

    it('should mix in properties passed', function(){
      frame = new AnimFrame({
        endTime: 10,
        imgSlotX: 2,
        imgSlotY: 2,
        image: new Image(),
        mock: true
      });

      expect(frame.endTime).toBe(10);
      expect(frame.imgSlotX).toBe(2);
      expect(frame.imgSlotY).toBe(2);
      expect(frame.image instanceof Image).toBe(true);
      expect(frame.mock).toBeDefined();
      expect(frame.mock).toBe(true);
    });
  });
});