/**
 * @name async.js
 * @author WangHongxin (QQ:2262118088)
 * @date 2015-1-21 21:37
 * @version 1.0.0
 * @Entities should not be multiplied unnecessarily
 * @don't repeat yourself
 */
;(function(Class,root){
	var Async=new Class({
		klass:'Async'
	});
	Async.implement({
		init:function(){
			this.list=[];
		},
		then:function(fn){
			this.list.push(fn);
			this.length++;
			return this;
		},
		wait:function(ms){
			this.list.push(ms);
			return this;
		},
		act:function(fn){
			var me=this,list=this.list;
			var item=list.shift()||'kill';
			if(typeof item==='number'){
				setTimeout(function(){
					me.act();
				},item);
			}else if(typeof item==='function'){
				item.call(this);
				if(list.length){
					me.act();
				}
			}else if(item==='kill'){
				return;
			}
		}
	});
	root.Async=Async;
}(Class,this));
