//构造函数
function keymap(bindings){
    this.map={};//定义按键标识符-->处理程序映射
    if(bindings){
        for(name in bindings){//给它赋值初始化绑定
            this.bind(name,bindings[name]);
        }
    }
}

//绑定指定按键标识符 和 指定处理程序
Keymap.prototype.bind = function (key,func) {
   this.map[Keymap.normalize(key)] =func;
}

//删除指定按键标识符的绑定
Keymap.prototype.unbind = function (key) {
    delete this.map[Keymap.normalize(key)];
};

//在指定HTML 元素上配置keymap
Keymap.prototype.install = function (element) {
    var keymap =this;
    function handler(event) {
        return keymap.dispatch(event,element);
    }
    if(element.addEventListener)
        element.addEventListener("keydown",handler,false);
    else if(element.attachEvent){
        element.attachEvent("onkeydown",handler)
    }
};
//这个方法基于keymap绑定分派按键事假
Keymap.prototype.dispatch=function (event,element) {
    //开始没有辅助键 和键名
    var modifiers = "";
    var keyname =null;
    //按照标准的小写字母顺序构建辅助键字符串
    if(event.altkey) modifiers +="alt_";
    if(event.ctrlKey) modifiers +="ctrl_";
    if(event.metaKey) modifiers +="meta_";
    if(event.shiftKey) modifiers +="shift_";
    if(event.key)
        keyname =event.key;
    else if(event.keyIdentifier && event.keyIdentifier.substring(0,2)!=="U+")
        keyname = event.keyIdentifier;
    else
        keyname = Keymap.keyCodeToKeyName[event.keyCode];
    //如果不能找到键名，只能返回并忽略这个事件
    if(!keyname) return ;

    var keyid = modifiers+keyname.toLowerCase();
    var handler = this.map[keyid];
    if(handler){
        var retval = handler.call(element,event,keyid);
        //如果处理函数返回false,取消默认操作并阻止冒泡
        if(retval === false){
            if(event.stopPropagation)
                event.stopPropagation();
            else
                event.cancelBubble = true;
            if(event.preventDefault)
                event.preventDefault();
            else
                event.returnValue = false;
        }
        return retval;
    }
};

//用于把按键标识符转换成标准形式的工具函数
//如 mac中 "Meta+c"变成 command+c
keymap.normalize = function (keyid) {
    keyid = keyid.toLowerCase();
    var words = keyid.split(/\s+|[\-+_]/);
    var keyname = words.pop();
    keyname = Keymap.aliases[keyname]||keyname;
    words.sort();
    worlds.push(keyname);
    return words.join("_");
};
Keymap.aliases ={
    "escape":"esc",
    "delete":"del",
    "return":"enter",
    "ctrl":"control",
    "space":"spacebar",
    "ins":"insert"
};

Keymap.keyCodeToKeyName ={
    8:"Backspace",9:"Tab",13:"Enter",
}


