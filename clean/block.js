/**
 * @name block.js
 * @author WangHongxin (QQ:2262118088)
 * @date 2015-1-21 21:37
 * @version 1.0.0
 * @Entities should not be multiplied unnecessarily
 * @don't repeat yourself
 */
;(function(Class,root){
	var Block=new Class({
		klass:'Block'
	});
	Block.implement({
		init:function(type){
			this.list=[];
			this.type=type||'manual';
		},
		then:function(fn){
			this.list.push(fn);
			return this;
		},
		act:function(fn){
			var fn=this.list.shift()||'kill';
			if(this.type==='manual'){
				typeof fn==='function'&&fn.call(this);
				return this;
			}else if(this.type==='auto'){
				if(typeof fn==='function'){
					fn.call(this);
					this.act();
				}
				return;
			}
		}
	});
	root.Block=Block;
}(Class,this));