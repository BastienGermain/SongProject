document.addEventListener("DOMContentLoaded", init, false);

var degree = 0;
var cube;

function init() {
  cube = document.getElementsByClassName("cube")[0];
  window.addEventListener("keydown", turn, false);
}

function turn(e) {
  if(document.activeElement === document.body) {
    if(e.key == "ArrowLeft") {
      turnBox(-90);
    } else if (e.key == "ArrowRight") {
      turnBox(90);
    }
  }
}

function turnBox(param) {
  degree += param;
  if(cube !== undefined) {
    cube.style.transform = "rotateY("+degree+"deg)";
  }
}
