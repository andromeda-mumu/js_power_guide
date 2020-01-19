/*
* elementToDrag 接收mousedown事件的元素或某些包含元素
* 它必须是绝对定位的元素
* 它的style.left  style.top值将随着用户的拖动而改变
*
* event:mousedown 事件对象
* */

function drag(elementToDrag,event) {
    //初始鼠标位置，转换为文档坐标
    var scroll = getScrollOffsets();
    var startX = event.clientX+scrollX;
    var startY = event.clientY+scrollY;

    //因为是绝对位置，所以可以假设它的offsetParent就是文档的body元素
    var  origX = elementToDrag.offsetLeft;
    var origY = elementToDrag.offsetTop;

    var deltaX= startX-origX;
    var deltaY =startY-origY;
    if(document.addEventListener){
        document.addEventListener("mousemove",moveHandler,true);
        document.addEventListener("mouseup",upHandler,true);
    }else if(document.attachEvent){
        //兼容IE 5-8
        elementToDrag.setCapture();
        elementToDrag.attachEvent("onmousemove",moveHandler);
        elementToDrag.attachEvent("onmouseup",unHandler);
        elementToDrag.attachEvent("onlosecapture",upHandler);
    }
    if(event.stopPropagation)
        event.stopPropagation();//标准模型
    else
        event.cancelBubble = true;//IE
    //阻止任何默认操作
    if(event.preventDefault)
        event.preventDefault();
    else
        event.returnValue =false;

    function moveHandler(e) {
        if(!e)e= window.event;
        var scroll = getScrollOffsets();
        elementToDrag.style.left =(e.clientX+scroll.x-deltaX)+"px";
        elementToDrag.style.top=(e.clientY+scroll.y-deltaY)+"px";
        //事件不传递了
        if(e.stopPropagation)
            e.stopPropagation();
        else
            e.cancleBubble = true;
    }

    function upHandler(e) {
        if(!e) e= window.event;
        if(document.removeEventListener){
            document.removeEventListener("mouseup",upHandler,true);
            document.removeEventListener("mousemove",moveHandler,true);
        }else if(document.detachEvent){
            elementToDrag.detachEvent("onlosecapture",upHandler);
            elementToDrag.detachEvent("onmouseup",upHandler);
            elementToDrag.detachEvent("onmousemove",moveHandler);
            elementToDrag.releaseCapture();
        }
        //不让事件进一步传播
        if(e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }

}