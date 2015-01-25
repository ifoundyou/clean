/**
 * @name class.js
 * @author WangHongxin (QQ:2262118088)
 * @date 2015-1-21 21:37
 * @version 1.0.0
 * @Entities should not be multiplied unnecessarily
 * @don't repeat yourself
 */
;(function(root){
	var has=Object.prototype.hasOwnProperty,
		implement=function(atts){
			for(var i in atts){
				if(has.call(atts,i)){
					this.prototype[i]=atts[i];
				}
			}
		},
		extend=function(atts){
			atts=atts||{};
			for(var i in atts){
				if(has.call(atts,i)){
					this[i]=atts[i];
				}
			}
		},
		define=function(param,context){
			if(typeof param==='function'){
				context=context||this;
				return param.call(context);;
			}
			var parts=param.split('.'),
				parent=context||this,
				i,
				l;
			for(i=0,l=parts.length;i<l;i++){
				if(typeof parent[parts[i]]==='undefined'){
					parent[parts[i]]={};
				}
				parent=parent[parts[i]];
			}
			parent.extend=extend;
			return parent;
		},
		Proxy=function(){},
		Hash={
			init:function(atts){
				atts=atts||{};
				for(var key in atts){
					if(atts.hasOwnProperty(key)){
						this.set(key,atts[key]);
					}
				}
				return this;
			},
			each:function(fn){
				for(var key in this){
					this.has(key)&&fn(this[key],key,this);	
				}
				return this;
			},
			has:function(key){
				return this.hasOwnProperty(key);
			},
			keyOf:function(value){
				var _key=false;
				for(var key in this){
					if(this.has(key)&&this[key]===value){
						_key=key;
						break;
					}
				}
				return _key;
			},
			hasValue:function(value){
				return !!this.keyOf(value);
			},
			extend:function(atts){
				atts=atts||{};
				for(var key in atts){
					if(atts.hasOwnProperty(key)){
						this.set(key,atts[key]);
					}
				}
				return this;
			},
			combine:function(atts){
				atts=atts||{};
				for(var key in atts){
					if(atts.hasOwnProperty(key)){
						this.include(key,atts[key]);
					}
				}
				return this;
			},
			erase:function(key){
				if (this.has(key)){
					delete this[key];
				}
				return this;
			},
			map:function(fn){
				var objMap={};
				typeof fn=="function"&&this.each(function(value,key){
					objMap[key]=fn(value);
				});
				return new Hash(objMap);
			},
			filter:function(fn){
				var objFilter={};
				typeof fn=="function"&&this.each(function(value,key) {
					if(fn(value,key)==true){
						objFilter[key]=value;
					}
				});
				return new Hash(objFilter);
			},
			every:function(fn){
				var isEveryPass=true;
				typeof fn=="function"&&this.each(function(value,key){
					if(isEveryPass==true&&fn(value,key)==false){
						isEveryPass=false;
					}
				});
				return isEveryPass;
			},
			some:function(fn){
				var isSomePass=false;
				typeof fn=="function"&&this.each(function(value,key){
					if(isSomePass==false&&fn(value,key)==true){
						isSomePass=true;
					}
				});
				return isSomePass;
			},
			get:function(key){
				if(this.has(key)){
					return this[key];	
				}
				return null;
			},
			set:function(key,value){
				this[key]=value;	
				return this;
			},
			empty:function(){
				this.each(function(value,key,hash){
					delete hash[key];
				});
				return this;
			},
			include:function(key,value){
				if (!this.has(key)){
					this.set(key,value);	
				}
				return this;
			},
			getClean:function(){
				var hash={};
				for(var key in this){
					if(this.has(key)){
						hash[key]=this[key];	
					}
				}
				return hash;
			},
			getKeys:function(){
				var arrKeys=[];
				this.each(function(value,key){
					arrKeys.push(key);
				});
				return 	arrKeys;
			},
			getValues:function(){
				var arrValues=[];
				this.each(function(value,key){
					arrValues.push(value);
				});
				return 	arrValues;
			},
			getLength:function(){
				var length = 0;
				this.each(function(){
					length++;
				});
				return length;
			},
			toQueryString:function(){
				var queryString=[];
				this.each(function(value,key){
					var queryPart;
					if (value instanceof Array){
						var queryArr={};
						for(var from = 0;from<value.length;from++) {
							queryArr[from]=value[from];	
						}
						queryPart=new Hash(queryArr).toQueryString();
					}else if(typeof value=="object"){
						queryPart=new Hash(value).toQueryString();
					}else{
						queryPart=key+'='+encodeURIComponent(value);	
					}
					
					if(value!==null){queryString.push(queryPart);}
				});
				
				return queryString.join('&');
			}
		},
		JS=function(atts){
			var JS=function(){
			    this.init.apply(this,arguments);
			};
			if(atts&&typeof atts.parent==='function'){
			    Proxy.prototype=atts.parent.prototype;
			    JS.fn=JS.prototype=new Proxy();
			    JS.fn.constructor=JS.fn.parent=JS;
			}else{
				JS.fn=JS.prototype=Object.create(Hash);
				JS.fn.constructor=JS.fn.parent=JS;
			}
			
			if(atts&&atts.klass){
				JS.fn.klass=atts.klass;
				JS.klass=atts.klass;
			}
			JS.extend=extend;
			JS.implement=implement;
			return JS;
		};
	root.Class=JS;
}(this));