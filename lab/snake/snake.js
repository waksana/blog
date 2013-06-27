var map, can, ctx, dx, dy, da, db, ax, ay, bx, by,int;
function move() {
  ax += dx[da];
  ay += dy[da];
  if(ax>99||ax<0||ay>99||ay<0||map[ax][ay]){
    alert("end");
    clearInterval(int);
    return;
  }
  map[ax][ay] = true;
  bx += dx[db];
  by += dy[db];
  if(bx>99||bx<0||by>99||by<0||map[bx][by]){
    alert("end");
    clearInterval(int);
    return;
  }
  map[bx][by] = true;
  draw();
}
window.document.onkeydown = function(event) {
  ec = event.keyCode;
  if (ec == 87 && da >= 2) da = 1;
  if (ec == 83 && da >= 2) da = 0;
  if (ec == 65 && da < 2) da = 3;
  if (ec == 68 && da < 2) da = 2;
  if (ec == 38 && db >= 2) db = 1;
  if (ec == 40 && db >= 2) db = 0;
  if (ec == 37 && db < 2) db = 3;
  if (ec == 39 && db < 2) db = 2;
}
function init() {
  var i, j;
  dx = new Array(0, 0, 1, -1);
  dy = new Array(1, -1, 0, 0);
  da = 2;
  db = 3;
  ax = 20;
  bx = 80;
  ay = 50;
  by = 50;
  can = document.getElementById("can");
  ctx = can.getContext("2d");
  iii=0;
  map = new Array(100);
  for (i = 0; i < 100; i++) {
    map[i] = new Array(100);
    for (j = 0; j < 100; j++) map[i][j] = false;
  }
}
function draw() {
  var i, j;
  for (i = 0; i < 100; i++) {
    for (j = 0; j < 100; j++) {
      if (map[i][j]) ctx.fillStyle = "#FFFFFF";
      else ctx.fillStyle = "#000000";
      ctx.fillRect(i * 5, j * 5, 5, 5);
    }
  }
}
