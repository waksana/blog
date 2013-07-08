var faceRed=new Image();
var faceBlue=new Image();
faceRed.src='red.png';
faceBlue.src='blue.png';
var donkai=10;
var don=new Array(donkai);
var ka=new Array(donkai);
var doni,kai;
for(doni=0;doni<donkai;doni++){
  don[doni]=document.createElement('audio');
  don[doni].src='don.wav';
  ka[doni]=document.createElement('audio');
  ka[doni].src='ka.wav';
}
var canX=800;
var canY=60;
var pTime=75;
var oTime=25;
var dTime=2200;
var fTime=300;
var Round=Math.PI*2;
var score,music,track,ins,di,dj,dk,don,ka,noti,red,blue,int;
var hitPoint=Math.round(fTime*canX/dTime);
var midY=canY/2;
var dRadius=Math.round(midY*.75);
function drawCircle(context,color,x,y,radius){
  context.fillStyle=color;
  context.beginPath();
  context.arc(x,y,radius,0,Round,true);
  context.closePath();
  context.fill();
}
window.onload=function(){
  noti=document.getElementById('score');
  music=document.getElementById('music');
  track=cxt('track');
  function cxt(id){
    var can=document.getElementById(id);
    return can.getContext('2d');
  }
  var bg=cxt('bg');
  drawCircle(bg,'yellow',hitPoint,midY,dRadius);
  red=document.createElement('canvas');
  blue=document.createElement('canvas');
  var cd=red.getContext('2d');
  var ck=blue.getContext('2d'); 
  cd.drawImage(faceRed,0,0,dRadius*2,dRadius*2);
  ck.drawImage(faceBlue,0,0,dRadius*2,dRadius*2);
  init();
  //int=self.setInterval('auto()',25);
  //int=self.setInterval('wak()',25);
}
function init(){
  doni=kai=score=di=dj=dk=0;
  ins=o.slice(0);
}
function pdon(){
  don[doni].play();
  doni=(doni+1)%donkai;
}
function pka(){
  ka[kai].play();
  kai=(kai+1)%donkai;
}
function start(mode){
  //init();
  if(int)self.clearInterval(int);
  int=self.setInterval(mode,25);
  music.play();
}
function wak(){
  var k,ct=music.currentTime*1000;
  if(ins[di]&&ct-ins[di][0]>fTime)di++;
  if(ins[dj]&&ins[dj][0]-ct<dTime)dj++;
  if(ins[dk]&&ct-ins[dk][0]>pTime)dk++;
  track.clearRect(0,0,canX,canY);
  for(k=dj-1;k>=di;k--){
    p=Math.round((ins[k][0]-ct+fTime)*canX/dTime);
    if(ins[k][1]==0){
      track.drawImage(red,p-dRadius,midY-dRadius);
    }
    else if(ins[k][1]==8){
      track.drawImage(blue,p-dRadius,midY-dRadius);
    }
  }
}
function auto(){
  wak();
  var ct=music.currentTime*1000;
  if(ins[dk]&&Math.abs(ct-ins[dk][0])<oTime){
    if(ins[dk][1]==0)pdon();
    else if(ins[dk][1]==8)pka();
    ins[dk][1]=9;
  }
}
window.document.onkeydown=function(event){
  var res='不可',pScore='',ct,color,ec=event.keyCode;
  if(ec==70||ec==74||ec==68||ec==75){
    ct=Math.abs(music.currentTime*1000-ins[dk][0]);
    if(ec==70||ec==74){
      color=0;
      pdon();
    }
    else{
      color=8;
      pka();
    }
    if(ct<pTime){
      if(ins[dk][1]==color){
        ins[dk][1]=9;
        if(ct>25){
          pScore=150;
          res='可';
        }
        else{
          pScore=300;
          res='良';
        }
        score+=pScore;
      }
    }
  }
  noti.innerHTML='<p>'+res+' '+pScore+'</p><p>'+score+'</p>';
}
