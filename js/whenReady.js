var whenReady = (function () {
    var funcs=[];
    var ready = false;
    //文档准备就绪时，调用事件处理程序
    function handler() {
        if(ready) return ;
        if(e.type ==="readystatechange" && document.readyState!=="complete")
            return;
        for(var i=0;i<funcs.length;i++){
            funcs[i].call(document);
        }
        ready =true;
        funcs=null
    }

    if(document.addEventListener){
        document.addEventListener("DOMContentLoad",handler,false);
        document.addEventListener("readystatecontent",handler,false);
        window.addEventListener("load",handler,false);
    }else if(document.attachEvent){
        document.attachEvent("onreadystatechange",handler);
        window.attachEvent("onload",handler);
    }
    //返回whenReady函数
    return function whenReady(f){
        if(ready) f.call(document);
        else funcs.push(f);
    }

}());