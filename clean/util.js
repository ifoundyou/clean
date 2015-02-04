/**
 * @name util.js(LikeMootools,not JQ)
 * @author WangHongxin (QQ:2262118088)
 * @date 2015-1-22 02:55
 * @version 1.0.0
 * @Entities should not be multiplied unnecessarily
 * @don't repeat yourself
 */
var AP=Array.prototype,OP=Object.prototype,FP=Function.prototype,
	hasEnumBug=!{toString: null}.propertyIsEnumerable('toString'),
	nonEnumerableProps=['constructor','valueOf','isPrototypeOf','toString',
	'propertyIsEnumerable','hasOwnProperty','toLocaleString'],
	MAX_ARRAY_INDEX=Math.pow(2, 53)-1;
function $lambda(item){
	return (typeof item=='function')?item:
		function(){
			return item;
		};
}
function $empty(){}
function $random(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}
var $clone=(function clone(target){
    var copy;
    if(target.constructor==Object)copy=new target.constructor(); 
    else copy=new target.constructor(target.valueOf()); 
    for(var key in target){
        if(copy[key]!=target[key]){ 
            if(typeof(target[key])=='object'){ 
                copy[key]=clone(target[key]);
            }else{
                copy[key]=target[key];
            }
        }
    }
    return copy; 
});
function $chk(obj){
	return !!(obj||obj===0);
}
function $if(value,func1,func2){
	if(value){
		func1&&func1();
	}else{
		func2&&func2();
	}
	return !!value;
}
function $f(value,func1){
	if(!value) func1&&func1();
	return value;
}
function $t(value,func1){
	if(value) func1&&func1();
}
function $defined(value){
	return !(value==null);
}
function $null(value){
	return (!value && typeof(value)!="undefined" && value!=0);
}
function $undefined(value){
	return typeof value==='undefined';
}
function $cb(func,context,value){
    if(context===void 0)return func;
    if(typeof value!='undefined'){
    	;
    	var args=Array.prototype.splice.call(arguments,2);
    	return function(){
    		var arg=args.concat(AP.slice.call(arguments));
    		return func.apply(context,arg);
    	}
    }
    return function() {
      return func.apply(context, arguments);
    };
}
function $isObject(obj) {
    var type=typeof obj;
    return type==='function'||type==='object'&&!!obj;
}
function $has(obj,key){
    return obj!=null&&OP.hasOwnProperty.call(obj,key);
}
function $indexOf(array, item, isSorted) {
    var i=0,length=array&&array.length;
    if(typeof isSorted=='number'){
      i=isSorted<0?Math.max(0,length+isSorted):isSorted;
    }else if(isSorted&&length){
      i=$sortedIndex(array,item);
      return array[i] === item ? i : -1;
    }
    for (;i<length;i++)if(array[i]===item)return i;
    return -1;
}
function $sortedIndex(array, obj, iteratee, context) {
    iteratee=_cb(iteratee,context,1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
}
function $identity(value) {
    return value;
}
function _cb(value, context, argCount) {
    if (value == null) return $identity;
    if ($isFunction(value)) return _optimizeCb(value, context, argCount);
    if ($isObject(value)) return $matches(value);
    return $property(value);
}
function $property(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
}
function $isFunction(obj) {
     return typeof obj == 'function' || false;
}
function $matches(attrs) {
    var pairs = $pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
}
function $pairs(obj) {
    var keys = $keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
}
function _optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
}
function $values(obj) {
    var keys = $keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
}
function $isArrayLike(collection) {
    var length=collection&&collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};
function $contains(obj, target, fromIndex) {
    if (obj == null) return false;
    if (!isArrayLike(obj)) obj = $values(obj);
    return $indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
}
function _collectNonEnumProps(obj, keys){
    var nonEnumIdx=nonEnumerableProps.length;
    var proto=typeof obj.constructor==='function'?FP:OP;
    while(nonEnumIdx--) {
      var prop=nonEnumerableProps[nonEnumIdx];
      if (prop==='constructor'?$has(obj,prop):prop in obj &&
        obj[prop]!==proto[prop]&&!$contains(keys,prop)){
        keys.push(prop);
      }
    }
}
function $keys(obj) {
    if (!$isObject(obj))return [];
    if (Object.keys)return Object.keys(obj);
    var keys = [];
    for(var key in obj)if($has(obj, key))keys.push(key);
    // Ahem, IE < 9.
    if(hasEnumBug)_collectNonEnumProps(obj, keys);
    return keys;
}
function $each(obj,iteratee,context) {
    if(obj==null)return obj;
    iteratee=$cb(iteratee,context);
    var i,length=obj.length;
    if(length===+length){
      for(i=0;i<length;i++){
        iteratee(obj[i],i,obj);
      }
    }else{
      var keys=_.keys(obj);
      for(i=0,length=keys.length;i<length;i++) {
        iteratee(obj[keys[i]],keys[i],obj);
      }
    }
    return obj;
}