function insideCanvas(pt, canvas){
  if((pt.x < 0) || (pt.x >  canvas.width) || (pt.y < 0) || (pt.y > canvas.height)){
    return false;
  } else {
    return true;
  }
}

module.exports = insideCanvas;
