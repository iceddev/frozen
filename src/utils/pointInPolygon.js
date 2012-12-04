define(function(){
  return function(pt, polygon){
      var poly = polygon.points || polygon;
      for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i){
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) && (c = !c);
      }
      return c;
    };
});