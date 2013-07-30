function reqer($scope,$http){
  $scope.methods=['GET','POST','HEAD','DELETE'];
  $scope.protocols=['http','https'];
  $scope.params=[];
  $scope.method=$scope.methods[0];
  $scope.protocol=$scope.protocols[0];
  $scope.getUrl=function(){
    var url=$scope.protocol+'://';
    url+=$scope.host||'hostname';
    url+='/'+($scope.path||'pathname');
    if($scope.params.length>0){
      url+='?';
      url+=$scope.params.map(function(p){
        return p.key+'='+p.value;
      }).join('&');
    }
    return url;
  };
  $scope.addParam=function(){
    $scope.params.push({key:$scope.key,value:$scope.value});
    $scope.key=$scope.value='';
  };
  $scope.cookie=function(){
    return document.cookie;
  };
  $scope.req=function(){
    $http({method:$scope.method,url:$scope.getUrl()}).
      success(function(data,status){
        $scope.res=data;
      }).
      error(function(data,status){
        $scope.res=data;
      });
  };
}
