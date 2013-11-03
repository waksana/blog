var yourcode={};
yourcode.CodeModel=Backbone.Model.extend({
  initialize:function(){
    this.on('change:key',this.getContent);
  },
  key:'',
  getContent:function(){
    var that=this;
    $.get('https://raw.github.com/'+this.get('key')
      ,function(content){
        that.set('content',content);
        console.log(content);
      })
    .fail(function(){
      that.set('content','sorry,failed to load code');
    });
  }
});
yourcode.codeModel=new yourcode.CodeModel(); 
yourcode.SearchView=Backbone.View.extend({
	el:'#search',
  events:{
    "keypress":"search"
  },
  search:function(e){
    if(e.which==13&&this.el.value.trim()){
      yourcode.codeModel.set('key',this.el.value);
      this.el.value='';
    }
  }
});
yourcode.CodeView=Backbone.View.extend({
  el:'#code',
  initialize:function(){
    this.listenTo(yourcode.codeModel,'change:content',this.addCode);
  },
  addCode:function(){
    var code=yourcode.codeModel.get('content');
    this.el.innerHTML=code;
  }
});
new yourcode.SearchView();
new yourcode.CodeView();