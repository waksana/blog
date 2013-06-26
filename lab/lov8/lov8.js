(function(win){
 var mul,runTime={},expIsOk,leva,lave,toArr;
 lave=function(args){
   var res,arr=args.
     replace(/\(/g," ( ").
     replace(/\)/g," ) ").
     replace(/\s{2,}/g," ").
     replace(/^ | $/,"").
     split(" ");
   if(arr[0]==="(")arr=toArr(arr);
   else arr=arr[0];
   try{
     res=leva(arr);
   }
   catch(e){
     console.log(e);
   }
   if(res)return res;
   return "Error";
 };
 leva=function(exp){
   if(typeof exp==="number")return exp;
   if(typeof exp==="string"){
     if(/^[\+|\-]{0,1}[0-9]+[.0-9]*$/g.test(exp)){
       return parseFloat(exp);
     }
     else if(runTime[exp])return runTime[exp];
     else throw "var not defined "+exp;
   }
   var fun=exp.shift();
   if(typeof fun==="Array")leva(fun);
   if(runTime[fun]){
     return runTime[fun].apply(runTime,exp);
   }
 };
 mul=function(fun,start){
   var res=function(){
     var ret=start,i,arg=arguments,len=arg.length;
     for(i=0;i<len;i++){
       ret=fun(ret,leva(arg[i]));
     }
     return ret;
   }
   return res;
 };
 runTime["+"]=mul(function(a,b){return a+b;},0);
 runTime["-"]=function(a,b){return leva(a)-leva(b);};
 runTime["*"]=mul(function(a,b){return a*b;},1);
 runTime["/"]=function(a,b){return leva(a)/leva(b);};
 runTime["define"]=function(a,b){
   var rep=function(exp,tp){
     var i,len=exp.length;
     for(i=0;i<len;i++){
       if(typeof exp[i]==="object")rep(exp[i],tp);
       else if(tp[exp[i]])exp[i]=tp[exp[i]];
     }
   };
   if(typeof a==="object"){
     if(typeof a[0]==="object")throw "var not correct";
     runTime[a[0]]=function(){
       var i,len=a.length,tp={};
       for(i=1;i<len;i++){
         tp[a[i]]=leva(arguments[i-1]);
       }
       rep(b,tp);
       console.log(b);
       return leva(b);
     };
   }
   else{
     runTime[a]=leva(b);
     console.log(a+" "+b);
   }
   return true;
 }
 toArr=(function(){
   var i,rec;
   rec=function(exp){
     var retArr=[];
     for(i+=1;exp[i]!==")";i++){
       if(exp[i]==="(")retArr.push(rec(exp));
       else retArr.push(exp[i]);
     }
     return retArr;
   };
   return function(exp){
     i=0;
     return rec(exp);
   }
 })();
 win.$=lave;
 //win.r=runTime;
})(window);
