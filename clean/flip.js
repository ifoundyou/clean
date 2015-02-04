;(function(Class,root){
	'use strict'
	var vendor_prefixs=['','webkit','moz','MS','ms','o'],//厂商前缀
		test_div=document.createElement('div'),//测试节点
		mobile_regex=/mobile|tablet|ip(ad|hone|od)|android/i,//是否手机端
		support_touch=('ontouchstart' in window),//是否支持触摸
		support_point_events=prefixed(window,'PointerEvent')!==undefined,//是否支持指针事件
		support_only_touch=support_touch&&mobile_regex.test(navigator.userAgent),
		input_type_touch='touch',
		input_type_mouse='mouse';
	var tap=document.createEvent('Event');
		tap.initEvent('tap');
	var swipe=document.createEvent('Event');
		swipe.initEvent('swipe');
	var swipeLeft=document.createEvent('Event');
		swipeLeft.initEvent('swipeLeft');
	var swipeRight=document.createEvent('Event');
		swipeRight.initEvent('swipeRight');
	var swipeTop=document.createEvent('Event');
		swipeTop.initEvent('swipeTop');
	var swipeDown=document.createEvent('Event');
		swipeDown.initEvent('swipeDown');
	var START=support_touch?'touchstart':'mousedown';
	var MOVE=support_touch?'touchmove':'mousemove';
	var END=support_touch?'touchend':'mouseup';
	function cb(fn,context){//维持某一个作用域
	    return function(){
	        return fn.apply(context, arguments);
	    };
	}
	function each(obj,iterator,context){//遍历数组以及类数组的数字索引，以及对象的本地属性
	    var i;
	    if (!obj){
	        return;
	    }
	    if(obj.forEach){
	        obj.forEach(iterator,context);
	    }else if(obj.length!==undefined){
	        i = 0;
	        while(i<obj.length){
	            iterator.call(context,obj[i],i,obj);
	            i++;
	        }
	    }else{
	        for(i in obj){
	            obj.hasOwnProperty(i)&&iterator.call(context,obj[i],i,obj);
	        }
	    }
	}
	function extend(dest,src,merge){//扩展
	    var keys=Object.keys(src),
	   		i = 0;
	    while(i<keys.length){
	        if(!merge||(merge&&dest[keys[i]]===undefined)){
	            dest[keys[i]]=src[keys[i]];
	        }
	        i++;
	    }
	    return dest;
	}
	function merge(dest,src){//掺和
	    return extend(dest,src,true);
	}
	function inherit(child,parent,properties){//继承，扩展原型
	    var parent_proto=parent.prototype,
	        child_proto;

	    child_proto=child.prototype=Object.create(parent_proto);
	    child_proto.constructor=child;
	    child_proto._super=parent_proto;

	    if(properties){
	        extend(child_proto,properties);
	    }
	}

	function bindHandler(target,types,handler){
	    each(splitStr(types),function(type) {
	        target.addEventListener(type, handler, false);
	    });
	}
	function splitStr(str) {
	    return str.trim().split(/\s+/g);
	}
	function inArray(src,find,findByKey){
	    if(src.indexOf&&!findByKey){
	        return src.indexOf(find);
	    }else{
	        var i = 0;
	        while(i<src.length){
	            if((findByKey&&src[i][findByKey]==find)||(!findByKey&&src[i]===find)){
	                return i;
	            }
	            i++;
	        }
	        return -1;
	    }
	}
	function toArray(obj) {
	    return Array.prototype.slice.call(obj, 0);
	}
	function uniqueArray(src,key,sort){
	    var results = [];
	    var values = [];
	    var i = 0;

	    while (i<src.length){
	        var val=key?src[i][key]:src[i];
	        if (inArray(values,val)<0){
	            results.push(src[i]);
	        }
	        values[i] = val;
	        i++;
	    }

	    if(sort){
	        if (!key){
	            results = results.sort();
	        }else{
	            results = results.sort(function sortUniqueArray(a,b){
	                return a[key]>b[key];
	            });
	        }
	    }

	    return results;
	}

	function prefixed(obj,property){
	    var prefix,prop;
	    var camelProp=property[0].toUpperCase()+property.slice(1);

	    var i=0;
	    while(i<vendor_prefixs.length){
	        prefix=vendor_prefixs[i];
	        prop=(prefix)?prefix+camelProp:property;

	        if(prop in obj){
	            return prop;
	        }
	        i++;
	    }
	    return undefined;
	}
	function flip(target,context){
		target.addEventListener(START,_start.bind(context),false);
	}
	function _start(e){
		console.log('start')
		var pos=e.touches&&e.touches[0]||e;
		this.startX=pos.pageX;
		this.startY=pos.pageY;

		var move=this._move=_move.bind(this);
		var end=this._end=_end.bind(this);
		this.node.addEventListener(MOVE,move,false);
		this.node.addEventListener(END,end,false);
		e.preventDefault();
	}
	function _move(e){
		var pos=e.touches&&e.touches[0]||e;
		this.x=pos.pageX;
		this.y=pos.pageY;

		e.preventDefault();
	}
	function _end(e){

		
		console.log('end');
		this.endX=this.x;
		this.endY=this.y;
		var node=this.node;
		var x=this.endX-this.startX;
		var y=this.endY-this.startY;
		if((Math.abs(x)<30&&Math.abs(y)<30)||typeof this.endX==='undefined'){
            node.dispatchEvent(tap);
        }else{
        	console.log(swipeDirection(this.startX,this.endX,this.startY,this.endY))
        	switch(swipeDirection(this.startX,this.endX,this.startY,this.endY)){
	        	case 'left':
	        		node.dispatchEvent(swipeLeft);
	        		break;
	        	case 'right':
	        		node.dispatchEvent(swipeRight);
	        		break;
	        	case 'top':
	        		node.dispatchEvent(swipeTop);
	        		break;
	        	case 'down':
	        		node.dispatchEvent(swipeDown);
	        		break;
	        }
        }
        
		this.node.removeEventListener(MOVE,this._move,false);
		this.node.removeEventListener(END,this._end,false);
		delete this.startX;
		delete this.startY;
		delete this.x;
		delete this.y;
		delete this.endX;
		delete this.endY;
		delete this._move;
		delete this._end;
		e.preventDefault();
	}
	//tap系列函数开始
	// function _tap(target,callback){
	// 	this._tap=true;
 //        target.addEventListener(START,function(e){

	// 		var touch=this._touch={};
 //            var pos=(e.touches&&e.touches[0])||e;
 //            touch.startX=touch.x=pos.pageX;
 //            touch.startY=touch.y=pos.pageY;
 //           	this._move=cb(move,this);
 //            this._end=cb(end,this);
 //            document.addEventListener(MOVE,this._move,false);
 //            document.addEventListener(END,this._end,false);
 //        }.bind(this),false);
 //    }

 //    function end(e){
 //    	var touch=this._touch;
 //        touch.endX=touch.x;
 //        touch.endY=touch.y;
 //        var task=this._task;
 //        var x=touch.endX-touch.startX;
 //        var y=touch.endY-touch.startY;
 //        if((Math.abs(x)<30&&Math.abs(y)<30)||typeof touch.endX==='undefined'){
 //            this.node.dispatchEvent(tap);
 //        }
 //        var dir=swipeDirection(touch.startX,touch.endX,touch.startY,touch.endY);
 //        // alert(dir);
 //        document.removeEventListener(MOVE,this._move,false);
 //        document.removeEventListener(END,this._end,false);
 //    }

 //    function move(e){
	// 	var touch=this._touch;
	//     var pos=(e.touches&&e.touches[0])||e;
	//     touch.x=pos.pageX;
	//     touch.y = pos.pageY;
	// }
	//tap系列函数结束
	//swipe系列函数开始
	function swipeDirection(x1,x2,y1,y2,sensitivity){
        var _x=Math.abs(x1-x2),
            _y=Math.abs(y1-y2),
            dir=_x>=_y?(x1-x2>0?'left':'right'):(y1-y2>0?'up':'down');
        if(sensitivity){
            if(dir==='left'||dir==='right'){
                if((_y/_x)>sensitivity){dir='';}
            }else if(dir=='up'||dir=='down'){
                if((_x/_y)>sensitivity){dir='';}
            }
        }
        return dir;
    }



	//hold函数
	//swipeLeft,swipeRight,swipeTop,swipeDown系列函数

	var Flip=new Class({
		klass:'Flip'
	});

	Flip.implement({
		init:function(node,options){
			this.node=node;
		},
		on:function(types,handler){
			bindHandler(this.node,types,handler);
			// if(inArray(splitStr(types),'tap')>=0&&!this._tap){
			// 	_tap.call(this,this.node,handler);
			// }
			if(!this.__once__){
				flip(this.node,this);
				this.__once__=true;
			}
		}
	});
	root.Flip=Flip;
}(Class,this));