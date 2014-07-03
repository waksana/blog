var time1, time2, sum = 0;
var z = 90, m = 77, dz = false, dm = false;
time1 = time2 = 100000000;

var t1 = document.getElementById('time1');
var t2 = document.getElementById('time2');
var ze = document.getElementById('ze');
var me = document.getElementById('me');
time1 = Math.random() * 100;
time2 = Math.random() * 100;

ze.onclick = function() {
  if(t1.style.display == 'none')
    t1.style.display = 'inline';
  else
    t1.style.display = 'none';
};
me.onclick = function() {
  if(t2.style.display == 'none')
    t2.style.display = 'inline';
  else
    t2.style.display = 'none';
};
t1.style.display = 'none';
t2.style.display = 'none';
t1.innerHTML = time1;
t2.innerHTML = time2;

var s = document.getElementById('sum');
var show = document.getElementById('show');
var over=false;
var interval;
var math = function() {
  time1-=0.05;
  time2-=0.05;
  sum += 0.1;
  t1.innerHTML = time1;
  t2.innerHTML = time2;
  s.innerHTML = sum;
  if(time1 < 0 && time2 < 0) {
    over = true;
    show.innerHTML = '游戏结束zm死了';
  }
  if(time1<0){
    over = true;
    show.innerHTML = '游戏结束Z死了';
  }
  if(time2<0){
    over = true;
    show.innerHTML = '游戏结束M死了';
  }
  if(over) {
    clearInterval(interval);
  }
}
window.onkeydown = function(e) {
  if(e.keyCode == z) dz = true;
  if(e.keyCode == m) dm = true;
  if(dz && dm && interval == null && !over){
    interval = setInterval(math, 50);
    show.innerHTML='';
  }
};

window.onkeyup = function(e) {
  if(e.keyCode == z) dz = false;
  if(e.keyCode == m) dm = false;
  if(!(dz && dm) && interval != null) {
    clearInterval(interval);
    interval = null;
    if(over) return;
    if(dz){
      time1 += sum;
      show.innerHTML = "Z获胜";
    }
    if(dm){
      time2 += sum;
      show.innerHTML = "M获胜";
    }
    if(!dz && !dm){
      time1 += sum/2;
      time2 += sum/2;
      show.innerHTML = "平手";
    }
    sum = 0;
    s.innerHTML = sum;
    t1.innerHTML = time1;
    t2.innerHTML = time2;
  }
};

