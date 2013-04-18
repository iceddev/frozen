define([
  'frozen/Sprite',
  'frozen/Animation'
], function(Sprite, Animation){

  'use strict';


  describe('Sprite', function(){

    var sprite;

    beforeEach(function(){
      sprite = new Sprite({anim: Animation.prototype.createFromSheet(8, 100, {}, 100, 100, 0)});
    });


    it('should have an x position at 0', function(){
      expect(sprite.x).toEqual(0);
    });

    it('should have a y position at 0', function(){
      expect(sprite.y).toEqual(0);
    });

    it('should have a dx equal to 0', function(){
      expect(sprite.dx).toEqual(0);
    });

    it('should have a dy equal to 0', function(){
      expect(sprite.dy).toEqual(0);
    });

    it('should have a null name', function(){
      expect(sprite.name).toBeNull();
    });

    it('should have a collisionRadius of 40', function(){
      expect(sprite.collisionRadius).toEqual(40);
    });

    it('should have functions defined', function(){
      expect(sprite.update).toBeDefined();
      expect(sprite.limitSpeed).toBeDefined();
      expect(sprite.getCurrentFrame).toBeDefined();
      expect(sprite.draw).toBeDefined();
      expect(sprite.clone).toBeDefined();
    });

    describe('Sprite.update()', function(){

      it('should update the position of the sprite', function(){
        sprite.dx = 1;
        sprite.update(16);
        expect(sprite.x).toEqual(16);
      });

    });

    describe('Sprite.limitSpeed()', function(){

      it('should cap the speed setting on a sprite to 20', function(){
        sprite.maxSpeed = 20;
        sprite.dx = sprite.limitSpeed(30);
        expect(sprite.dx).toEqual(20);
      });

    });

    describe('Sprite.getCurrentFrame()', function(){

      it('should return the current frame from the animation', function(){
        var currentFrame = sprite.getCurrentFrame();
        expect(currentFrame).not.toBeNull();
      });

    });

    describe('Sprite.clone()', function(){

      it('should clone the sprite', function(){
        var sprite2 = sprite.clone();
        expect(sprite2).not.toBeNull();
      });

    });


  });

});