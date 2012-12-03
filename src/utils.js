define([

], function(){
	//store these for effeciency
	var radConst = Math.PI / 180.0;
	var degConst = 180.0 / Math.PI;
	
	return {
		degreesToRadians: function(degrees){
			return degrees * radConst;
		},
		radiansToDegrees: function(radians){
			return radians * degConst;
		},
		pointInPolygon: function(pt, polygon){
			var poly = polygon.points || polygon;
			for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i){
				((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)	&& (c = !c);
			}
			return c;
		},
		distance: function(p1, p2){
			return Math.sqrt( ((p2.x - p1.x) * (p2.x - p1.x)) + ((p2.y - p1.y) * (p2.y - p1.y)) );
		},
		degreesBetweenPoints: function(center, pt){
			//same point
			if((center.x === pt.x) && (center.y === pt.y)){
				return 0;
			}else if(center.x === pt.x){
				if(center.y < pt.y){
					return 180;
				}else{
					return 0;
				}
			}else if(center.y === pt.y){
				if(center.x > pt.x){
					return 270;
				}else{
					return 90;
				}
			}else if((center.x < pt.x) && (center.y > pt.y)){
				//quadrant 1
				console.log('quad1',center.x,center.y,pt.x,pt.y,'o',pt.x - center.x,'a',pt.y - center.y);
				return Math.atan((pt.x - center.x)/(center.y - pt.y)) * (180 / Math.PI);
			}
			else if((center.x < pt.x) && (center.y < pt.y)){
				//quadrant 2
				console.log('quad2',center.x,center.y,pt.x,pt.y);
				return 90 + Math.atan((pt.y - center.y)/(pt.x - center.x)) * (180 / Math.PI);
			}
			else if((center.x > pt.x) && (center.y < pt.y)){
				//quadrant 3
				console.log('quad3',center.x,center.y,pt.x,pt.y);
				return 180 + Math.atan((center.x - pt.x)/(pt.y - center.y)) * (180 / Math.PI);
			}
			else{
				//quadrant 4
				console.log('quad4',center.x,center.y,pt.x,pt.y);
				return 270 + Math.atan((center.y - pt.y)/(center.x - pt.x)) * (180 / Math.PI);
			}

		}

	};
});