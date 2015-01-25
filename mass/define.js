var JS=JS||{};
JS.define=function(ns_str){
	var parts=ns_str.split('.'),
		pre=JS;
	parts[0]==='JS'&&parts.shift();
	var i=0,l=parts.length;
	for(;i<l;i++){
		typeof pre[parts[i]]==='undefined'&&(pre[parts[i]]={});
		pre=JS[parts[i]];
	}
	return pre;
};
function inherit(C,P){
	var F=function(){};
	F.prototype=P.prototype;
	C.prototype=new F();
	C.uber=P.prototype;
	C.prototype.constructor=C;
}
var inherit=function(){
	var F=function(){};
	return function(C,P){
		F.prototype=P.prototype;
		C.prototype=new F();
		C.uber=P.prototype;
		C.prototype.constructor=C;
	} 
}();