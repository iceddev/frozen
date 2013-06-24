define([
  'dcl',
  'frozen/box2d/entities/Circle',
  'frozen/reiner/Creature',
  'frozen/Animation',
  'frozen/utils/degreesFromCenter'
], function(dcl, Circle, Creature, Animation, degreesFromCenter){

  'use strict';

  return dcl([Creature, Circle], {
    radius: 15,
    restitution: 1,
    linearDamping: 0,
    angularDamping: 0,
    staticBody: false,
    direction: 0,
    anims: [],
    img: null,
    constructor: function(){
      this.createAnimations();
    },
    draw: function(ctx, scale){
      this.anims[this.direction].draw(ctx, this.x * scale - 48, this.y * scale - 48);
    },
    updateAnimations: function(millis){
      this.updateDirection();
      this.anims[this.direction].update(millis);
    },
    createAnimations: function(){
      this.anims = [];
      for(var i = 0; i < 8; i++){
        this.anims[i] = new Animation({height: 96, width: 96, image: this.img});
        for(var j = 0; j < 8; j++){
          this.anims[i].addFrame(125,j + 8 * i,0);
        }
      }
    },
    updateDirection: function(){
      if(this.linearVelocity){
        var degrees = degreesFromCenter(null, this.linearVelocity);

        if(degrees >= 22.5 && degrees < 67.5){
          this.direction = this.statics.NORTHEAST;
        }
        else if(degrees >= 67.5 && degrees < 112.5){
          this.direction = this.statics.EAST;
        }
        else if(degrees >= 112.5 && degrees < 157.5){
          this.direction = this.statics.SOUTHEAST;
        }
        else if(degrees >= 157.5 && degrees < 202.5){
          this.direction = this.statics.SOUTH;
        }
        else if(degrees >= 202.5 && degrees < 247.5){
          this.direction = this.statics.SOUTHWEST;
        }
        else if(degrees >= 247.5 && degrees < 292.5){
          this.direction = this.statics.WEST;
        }
        else if(degrees >= 292.5 && degrees < 337.5){
          this.direction = this.statics.NORTHWEST;
        }
        else{
          this.direction = this.statics.NORTH;
        }
      }
    }
  });

});
