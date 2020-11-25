//获取url带来的参数
function request(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if (r != null) return decodeURI(r[2]);
	return null; //返回参数值
}
//获取表单参数值
function getFormField(formId) {
	var params={};
	var formArray = $(formId).serializeArray();
	$.each(formArray, function(name, value) {
		params[this.name]=this.value;
	});
	return params;
}

var socket;
function openSocket(userId) {
	if(typeof(WebSocket) == "undefined") {
		console.log("您的浏览器不支持WebSocket");
	}else{
		console.log("您的浏览器支持WebSocket");
    	var userId = document.getElementById('userId').value;
    	var socketUrl="ws://192.168.0.231:22599/webSocket/"+userId;
    	if(socket!=null){
    		socket.close();
    		socket=null;
        }
    	socket = new WebSocket(socketUrl);
        //监听打开事件
    	socket.onopen = function() {
    		console.log("websocket已打开");
        };
        //监听获得消息事件
        socket.onmessage = function(msg) {
        	var serverMsg = "收到服务端信息：" + msg.data;
        };
        //关闭事件
        socket.onclose = function() {
            console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function() {
            console.log("websocket发生了错误");
        };
        socket.sendMsg = function(msg) {
        	socket.send(msg);
        };
        
    }
}
//设置token
function setToken(token) {
	if(!window.sessionStorage){
		alert("oo，您的浏览器不支持sessionStorage");
	}else{
		var sessionStorage = window.sessionStorage;
		sessionStorage.removeItem("token");
		sessionStorage.setItem("token",token);
	}
}
//取token
function getToken() {
	if(!window.sessionStorage){
		alert("oo，您的浏览器不支持sessionStorage");
	}else{
		var sessionStorage = window.sessionStorage;
		return sessionStorage.getItem("token");
	}
}
//清除token
function deleteToken() {
	if(!window.sessionStorage){
		alert("oo，您的浏览器不支持sessionStorage");
	}else{
		var sessionStorage = window.sessionStorage;
		sessionStorage.removeItem("token");
	}
}
//获取网关服务地址
function getwayUrl() {
	return "http://192.168.120.208:9101";
}

//封装ajax同步POST请求
function sendAjax(url,params) {
	var resultData = {"success":false};
	$.ajax({
	    url:url,
	    data:params,
	    headers: {"token":getToken()},
	    type:"Post",
	    dataType:"json",
	    async: false,//同步，请求完成再执行后续代码
	    success:function(data){
	    	resultData = data;
	    	if(data.success == false) {
	    		if(data.code == 2001 || data.code == 2002 || data.code == 2005 || data.code == 2006) {
	    			var index = layer.open({
	    				id:'reLogin',
	    				title:"提示",
	    				btn: '重新登录',
	    				btnAlign: 'c',
	    				content: data.msg,
	    				yes: function(index, layero){
	    					//删除本地token
			    			deleteToken();
		    				window.location.href="/public/login.html";
	    				},
	    				closeBtn: 0
	    			});
	    		}else {
	    			layer.msg(data.msg);
	    		}
	    	}
	    },
	    error:function(data){
	    	layer.msg("请求出错啦！");
	    }
	});
	return resultData;
}




	