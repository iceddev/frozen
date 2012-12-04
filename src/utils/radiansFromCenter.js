define(function(){
  return function(center, pt){
      //same point
      if((center.x === pt.x) && (center.y === pt.y)){
        return 0;
      }else if(center.x === pt.x){
        if(center.y < pt.y){
          return 0;
        }else{
          return Math.PI;
        }
      }else if(center.y === pt.y){
        if(center.x > pt.x){
          return 1.5 * Math.PI;
        }else{
          return Math.PI / 2;
        }
      }else if((center.x < pt.x) && (center.y > pt.y)){
        //quadrant 1
        //console.log('quad1',center.x,center.y,pt.x,pt.y,'o',pt.x - center.x,'a',pt.y - center.y);
        return Math.atan((pt.x - center.x)/(center.y - pt.y));
      }
      else if((center.x < pt.x) && (center.y < pt.y)){
        //quadrant 2
        //console.log('quad2',center.x,center.y,pt.x,pt.y);
        return Math.PI / 2 + Math.atan((pt.y - center.y)/(pt.x - center.x));
      }
      else if((center.x > pt.x) && (center.y < pt.y)){
        //quadrant 3
        //console.log('quad3',center.x,center.y,pt.x,pt.y);
        return Math.PI + Math.atan((center.x - pt.x)/(pt.y - center.y));
      }
      else{
        //quadrant 4
        //console.log('quad4',center.x,center.y,pt.x,pt.y);
        return 1.5 * Math.PI + Math.atan((center.y - pt.y)/(center.x - pt.x));
      }

    };
});