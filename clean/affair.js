/**
 * @name affair.js(LikeMootools,not JQ)
 * @author WangHongxin (QQ:2262118088)
 * @date 2015-1-21 21:37
 * @version 1.0.0
 * @Entities should not be multiplied unnecessarily
 * @don't repeat yourself
 */
;(function(Class,root){
  var Affair=new Class({
    klass:'Affair'
  });
  Affair.implement({
    on:function(name,callback,context){
      if(!Affair.eventsApi(this,'on',name,[callback,context])||!callback)return this;
      this._events||(this._events={});
      var events=this._events[name]||(this._events[name]=[]);
      events.push({callback:callback,context:context,ctx:context||this});
      return this;
    },
    off:function(name,callback,context){
      var retain,ev,events,names,i,l,j,k;
      if(!this._events||!Affair.eventsApi(this,'off',name,[callback, context]))return this;
      if(!name&&!callback&&!context){
        this._events=void 0;
        return this;
      }
      names=name?[name]:_.keys(this._events);
      for(i=0,l=names.length;i<l;i++){
        name=names[i];
        if(events=this._events[name]){
          this._events[name]=retain=[];
          if(callback||context){
            for(j=0,k=events.length;j<k;j++){
              ev=events[j];
              if((callback&&callback!==ev.callback&&callback!==ev.callback._callback)||
                  (context&&context!==ev.context)){
                retain.push(ev);
              }
            }
          }
          if(!retain.length)delete this._events[name];
        }
      }

      return this;
    },
    trigger:function(name){
      if(!this._events)return this;
      var args=Array.prototype.slice.call(arguments,1);
      if(!Affair.eventsApi(this,'trigger',name,args))return this;
      var events=this._events[name];
      var allEvents=this._events.all;
      if(events)Affair.triggerEvents(events,args);
      if(allEvents)Affair.triggerEvents(allEvents,arguments);
      return this;
    },
    stopListening:function(obj,name,callback){
      var listeningTo=this._listeningTo;
      if(!listeningTo)return this;
      var remove=!name&&!callback;
      if(!callback&&typeof name==='object')callback=this;
      if(obj)(listeningTo={})[obj._listenId]=obj;
      for(var id in listeningTo){
        obj=listeningTo[id];
        obj.off(name,callback,this);
        if(remove||_.isEmpty(obj._events))delete this._listeningTo[id];
      }
      return this;
    }
  });
  Affair.extend({
    eventsApi:function(obj,action,name,rest){
        if(!name)return true;
        if(typeof name==='object'){
          for(var key in name){
            obj[action].apply(obj,[key,name[key]].concat(rest));
          }
          return false;
        }

        if(Affair.eventSplitter.test(name)){
          var names=name.split(Affair.eventSplitter);
          for(var i=0,l=names.length;i<l;i++) {
            obj[action].apply(obj,[names[i]].concat(rest));
          }
          return false;
        }

        return true;
    },
    eventSplitter:/\s+/,
    triggerEvents:function(events,args) {
      var ev,i=-1,l=events.length,a1=args[0],a2=args[1],a3=args[2];
      switch(args.length){
        case 0:while(++i<l)(ev=events[i]).callback.call(ev.ctx);return;
        case 1:while(++i<l)(ev=events[i]).callback.call(ev.ctx,a1);return;
        case 2:while(++i<l)(ev=events[i]).callback.call(ev.ctx,a1,a2);return;
        case 3:while(++i<l)(ev=events[i]).callback.call(ev.ctx,a1,a2,a3);return;
        default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx,args);return;
      }
    }
  });
  root.Affair=Affair;
}(Class,this));