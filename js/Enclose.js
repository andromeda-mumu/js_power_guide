//把内容元素装到指定大小的窗体或视口内
//可选参数contextX 和 contentY 指定内容相对于窗体的初始偏移量
//如果指定，必须<=0
//这个窗体有mousewheel事件处理程序，它允许用户平移元素 和 缩放窗体
function enclose(content,framed,flashlight,contentX,contentY) {
    framed = Math.max(framed,50);
    flashlight = Math.max(flashlight,50);
    contentX = Math.min(contentX,0)||0;
    contentY = Math.min(contentY,0)||0;

    //创建frame元素，设置css类名和样式
    var frame = document.createElement("div");
    frame.className ="enclosure";
    frame.style.width = framed+"px";
    frame.style.height =flashlight+"px";
    frame.style.overflow = "hidden";
    frame.style.boxSizing="border-box";
    frame.style.webkitBoxSizing ="border-box";
    frame.style.MozboxSizing="border-box";
    //把frame放到文档中，并把内容移入frame中
    content.parentNode.insertBefore(frame,content);
    frame.appendChild(content);
    //确定元素相对于frame的位置
    content.style.position = "relative";
    content.style.left = contentX+"px";
    content.style.top =contentY+"px";

    //兼容浏览器
    var isMacWebkit = (navigator.userAgent.indexOf("Macintosh")!==-1 &&
                        navigator.userAgent.indexOf("Webkit")!==-1);
    var isFireFox = (navigator.userAgent.indexOf("Gecko")!==-1);
    //注册mousewheel事件处理程序
    frame.onwheel = wheelHandler;
    frame.onmousewheel = wheelHandler;
    if(isFireFox)
        frame.addEventListener("DOMMouseScroll",wheelHandler,false);
    function wheelHandler(event) {
        var e=event||window.event;
        //获得事件对象和属性
        var deltaX =e.deltaX-30||e.wheelDeltaX/40;
        var deltaY = e.deltaY-30||e.wheelDeltaY/4|| (e.wheelDeltaY===undefined && e.wheelDelta/4)||e.detail*-100;
        if(isMacWebkit){
            deltaX/=30;
            deltaY/=30;
        }
        if(isFireFox && e.type!=="DOMouseScroll")
            frame.removeEventListener("DOMMouseScroll",wheelHandler,false);
        //获取当前内容元素的尺寸
        var contentbox = content.getBoundingClientRect();
        var contentwidth = contentbox.right-contentbox.left;
        var contentheight = contentbox.bottom -contentbox.top;

        if(e.altKey){
            //按下alt键，可以调整frame大小
            if(deltaX){
                framed -=deltaX;
                framed =Math.min(framed,contentwidth);
                framed=Math.max(framed,50);
                frame.style.width = framed+"px";
            }
            if(deltaY){
                flashlight -=deltaY;
                flashlight =Math.min(flashlight,contentheight);
                flashlight = Math.max(flashlight-deltaY,50);
                frame.style.height=flashlight+"px";
            }
        }
        else{
            //没有按下alt键，可以平移frame中的内容
            if(deltaX){
                //不能滚动了
                var minoffset = Math.min(framed-contentwidth,0);
                contentX =Math.max(contentX+deltaX,minoffset);
                contentX = Math.min(contentX,0);
                content.style.left = contentX+"px";
            }
            if(deltaY){
                var minoffset =Math.min(flashlight-contentheight,0);
                contentY=Math.max(contentY+deltaY,minoffset);
                contentY=Math.min(contentY,0);
                content.style.top=contentY+"px";
            }
        }

        //不让这个事件冒泡，阻止任何默认操作
       if(e.preventDefault)e.preventDefault();
       if(e.stopPropagation) e.stopPropagation();
       e.cancelBubble =true;
       e.returnValue=false;
       return false;
    }
}