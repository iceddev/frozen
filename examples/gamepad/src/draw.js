define([
  'frozen/plugins/loadImage!images/track.png'
], function(trackImg){

  'use strict';

  return function(ctx){
    ctx.drawImage(trackImg, 0, 0);
    this.entities.car.draw(ctx);
    ctx.fillStyle = "#F00";
    ctx.strokeStyle = '#000';
    ctx.font = 'bold 20px arial';
    ctx.fillText(this.message, 20, this.height - 10);
    ctx.strokeText(this.message, 20, this.height - 10);
  };

});