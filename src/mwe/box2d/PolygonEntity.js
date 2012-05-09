dojo.provide("mwe.box2d.PolygonEntity");

dojo.require('mwe.box2d.Entity');

dojo.declare("mwe.box2d.PolygonEntity", [mwe.box2d.Entity], {
  points: null,
  constructor: function(/* Object */args){
        dojo.safeMixin(this, args);
        if(!this.points){
          this.points = [];
        }
    },
    draw: function(ctx){
      ctx.save();
      ctx.translate(this.x * SCALE, this.y * SCALE);
      ctx.rotate(this.angle);
      ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
      ctx.fillStyle = this.color;

      ctx.beginPath();
      ctx.moveTo((this.x + this.points[0].x) * SCALE, (this.y + this.points[0].y) * SCALE);
      for (var i = 1; i < this.points.length; i++) {
         ctx.lineTo((this.points[i].x + this.x) * SCALE, (this.points[i].y + this.y) * SCALE);
      }
      ctx.lineTo((this.x + this.points[0].x) * SCALE, (this.y + this.points[0].y) * SCALE);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
      this.inherited(arguments);
    }
});
