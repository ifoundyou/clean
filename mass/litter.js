var deepCopy=(function deepCopy(c,p){  
	var c=c||{};  
	for(var i in p){  
		if(p.hasOwnProperty(i)){
			if(typeof p[i]==='object'){  
				c[i]=(p[i].constructor===Array)?[]:{};  
				deepCopy(c[i],p[i]);  
			}else{  
			　c[i]=p[i];  
			}
		}  
	}  
	return c;  
});
function shallowCopy(c,p) {  
	var c=c||{};  
	for(var i in p){   
		if(p.hasOwnProperty(i)){
			c[i]=p[i];
		}  
	}  
	c.uber=p;  
	return c;  
}
function object(o) {  
	function F(){}  
	F.prototype = o;  
	return new F();  
} 
