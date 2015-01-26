/**
 * @name tap.js
 * @author WangHongxin (QQ:2262118088)
 * @date 2015-1-26 21:55
 * @version 1.0.0
 * @Entities should not be multiplied unnecessarily
 * @don't repeat yourself
 */
function Tap(){
	var touch={};
    var action_click='ontouchstart' in window?'touchstart':'mousedown';
    var action_move='ontouchmove' in window?'touchmove':'mousemove';
    var action_up='ontouchend' in window?'touchend':'mouseup';

    function rendor(target,callback,container){
        target.addEventListener(action_click,function(e){
            var pos=(e.touches&&e.touches[0])||e;
            touch.x1=pos.pageX;
            touch.y1=pos.pageY;
            container.addEventListener(action_move,move,false);
            container.addEventListener(action_up,end,false);
        },false);

        function move(e){
            var pos=(e.touches&&e.touches[0])||e;
            touch.x2=pos.pageX;
            touch.y2 = pos.pageY;
        }
        function end(e){
            touch.x3=touch.x2;
            touch.y3=touch.x2;
            var x=touch.x2-touch.x1;
            var y=touch.y2-touch.y1;
            if((Math.abs(x)<30&&Math.abs(y)<30)||typeof touch.x2==='undefined'){
                callback(e);
            }
            container.removeEventListener(action_move,move,false);
            container.removeEventListener(action_up,end,false);
            touch={};
        }
    }
    return {
        init:function(opts){
            var target=this.target=opts.target;
            callback=opts.fn;
            rendor(target,callback,opts.container);
        }
    }
}