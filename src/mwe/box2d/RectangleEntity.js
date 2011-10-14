dojo.provide("mwe.box2d.RectangleEntity");

dojo.require('mwe.box2d.Entity');

dojo.declare("mwe.box2d.RectangleEntity", [mwe.box2d.Entity], {
	halfWidth: 1,
	halfHeight: 1,
	
    constructor: function(/* Object */args){
        dojo.safeMixin(this, args);
    },
    draw: function(ctx){
      ctx.save();
      ctx.translate(this.x * SCALE, this.y * SCALE);
      ctx.rotate(this.angle);
      ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
      ctx.fillStyle = this.color;
      ctx.fillRect((this.x-this.halfWidth) * SCALE,
                   (this.y-this.halfHeight) * SCALE,
                   (this.halfWidth*2) * SCALE,
                   (this.halfHeight*2) * SCALE);
      ctx.restore();
      this.inherited(arguments);
    }
});