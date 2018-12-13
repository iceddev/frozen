
function translatePoints(points, translation){
  if(Array.isArray(points)){
    points = points.map(function(point){
      return translatePoints(point, translation);
    });
  } else {
    points = {
      x: points.x,
      y: points.y
    };

    if(translation.x != null){
      points.x += translation.x;
    }

    if(translation.y != null){
      points.y += translation.y;
    }
  }
  return points;
}

module.exports = translatePoints;
