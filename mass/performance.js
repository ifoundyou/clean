onload=function(){
  alert(performance.getEntries)
  // var t = performance.timing;
  // var pageloadtime = t.loadEventStart - t.navigationStart;
  // var dns = t.domainLookupEnd - t.domainLookupStart;
  // var tcp = t.connectEnd - t.connectStart;
  // var ttfb = t.responseStart - t.navigationStart;
  // alert('页面加载的耗时：'+pageloadtime+';域名解析的耗时：'+dns+';链接的耗时'+tcp+';获取第一个链接的耗时'+ttfb);
  var array=performance.getEntries();
  array.forEach(function(item,index){
    alert(item.name+':'+item.responseEnd)
  });
};