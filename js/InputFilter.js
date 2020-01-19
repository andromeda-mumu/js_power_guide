/***
 * 查找文档中拥有"data-allowed-chars属性的所有<input type="text">元素
 * 为所有这类元素注册keypress textInput  textInput 事件处理程序
 * 限制用户只能输入许可的字符
 * 如果<input>元素有一个 “data-messageid"属性，那么可以认为这个值是另一个元素的ID
 * */
whenReady(function () {
    var inputelts = document.getElementsByTagName("input");
    for(var i=0;i<inputelts.length;i++){
          var elt = inputelts[i];
          if(elt.type !="text" || !elt.getAttribute("data-allowed-chars"))
              continue;
          if(elt.addEventListener){
              elt.addEventListener("keypress",filter,false);
              elt.addEventListener("textInput",filter,false);
              elt.addEventListener("textinput",filter,false);
          }else{
              elt.attachEvent("onkeypress",filter);
          }
    }
    function filter(event) {
        var e= event || window.event;
        var target = e.target || e.srcElement;
        var text = null;
        if(e.type==="textinput"||e.type==="textInput")
            text =e.data;
        else{
            var code =e.charCode || e.keyCode;
            if(code<32 ||e.charCode==0 || e.ctrlKey || e.altKey)
                return;//不过滤这个事件
            var text = String.fromCharCode(code);//让字符编码转换成字符串
        }
        var allowed = target.getAttribute("data-allowed-chars");
        var messageid =target.getAttribute("data-messageid");
        if(messageid)
            var messageElement = document.getElementById(messageid);

        //遍历输入文本中的字符
        for(var i=0;i<text.length;i++){
           var c= text.chatAt(i);
           if(allowed.indexOf(c)==-1){ //不允许的字符
               if(messageElement) messageElement.style.visibility ="visible";
               //取消默认行为，不会插入文本
               if(e.preventDefault) e.preventDefault();
               if(e.returnValue) e.returnValue =false;
               return false;
           }
        }
        if(messageElement)messageElement.style.visibility ="hidden";
    }
});