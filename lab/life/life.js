var map,t,can,ctx;
function init(){
  can=document.getElementById("can");
  ctx=can.getContext("2d");
  map=new Array(2);
  map[0]=new Array(100);
  map[1]=new Array(100);
  for(var i=0;i<100;i++){
    map[0][i]=new Array(100);
    map[1][i]=new Array(100);
    for(var j=0;j<100;j++){
      if(Math.random()>.5)map[0][i][j]=true;
      else map[0][i][j]=false;
    }
  }
  t=1;
}
function change(){
  var i,j,f,k,l,al;
  f=1-t;
  for(i=0;i<100;i++){
    for(j=0;j<100;j++){
      al=0;
      for(k=-1;k<=1;k++){
        for(l=-1;l<=1;l++){
          if(map[f][((i+k)+100)%100][((j+l)+100)%100])al++;
        }
      }
      if(al>4)map[t][i][j]=true;
      else map[t][i][j]=false;
    }
  }
  draw();
  t=f;
}
function draw(){
  var i,j;
  for(i=0;i<100;i++){
    for(j=0;j<100;j++){
      if(map[t][i][j])ctx.fillStyle="#FFFFFF";
      else ctx.fillStyle="#000000";
      ctx.fillRect(i*5,j*5,5,5);
    }
  }
}
