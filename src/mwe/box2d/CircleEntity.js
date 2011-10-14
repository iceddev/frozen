dojo.provide("mwe.box2d.CircleEntity");

dojo.require('mwe.box2d.Entity');

dojo.declare("mwe.box2d.CircleEntity", [mwe.box2d.Entity], {
	radius: 1,
	
    constructor: function(/* Object */args){
        dojo.safeMixin(this, args);
    },
    draw: function(ctx){

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE, 0, Math.PI * 2, true);          
      ctx.closePath();
      ctx.fill();

      
      ctx.strokeStyle = '#000000';
      ctx.beginPath();
      ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE, 0, Math.PI * 2, true);          
      ctx.closePath();
      ctx.stroke();
      
      this.inherited(arguments);
    }
});