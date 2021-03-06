<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>游戏大厅</title>
<script type="text/javascript" src="/js/jquery-2.2.0.min.js"></script>

</head>
<body>
欢迎您, <font color="blue">  ${Session.user.name!"游客"} </font>, <span id="userStatus"></span>，请选择房间  <br/>
<#list roomList as room>
<input type="button" id="${room.id}" value="${room.value}" onclick="enterRoom(${room.idx});"/>
</#list>
 


<br><br><br><br><br>

<input type="button" value="离开游戏" onclick="logout()" />
<div id="message">
</div>
</body>
<script type="text/javascript">

	function logout(){
		gotoUrl("/logout.do");
	}
	function enterRoom(roomNo) {
		gotoUrl("/enterRoom.do?roomNo="+roomNo);
	}
 
    var websocket = null;
    //判断当前浏览器是否支持WebSocket
    if('WebSocket' in window){
        websocket = new WebSocket("ws://localhost:80/websocket");
    } else{
        alert('Not support websocket')
    }
    //连接发生错误的回调方法
    websocket.onerror = function(){
        setMessageInnerHTML("error");
    };
    //连接成功建立的回调方法
    websocket.onopen = function(event){
        //setMessageInnerHTML("open");
        $("#userStatus").html("您已经进入游戏大厅");
    }
    //接收到消息的回调方法
    websocket.onmessage = function(event){
        setMessageInnerHTML(event.data);
    }
    //连接关闭的回调方法
    websocket.onclose = function(){
        //setMessageInnerHTML("close");
        $("#userStatus").html("您已断开连接,请重新登录，3秒后将转向登录页面!");//后期考虑断线重连
        // gotoUrl("/index.html");
    }
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function(){
        websocket.close();
    }
    //将消息显示在网页上
    function setMessageInnerHTML(innerHTML){
        document.getElementById('message').innerHTML += innerHTML + '<br/>';
    }
    //关闭连接
    function closeWebSocket(){
        websocket.close();
    }
    //发送消息
    function send(){
        var message = document.getElementById('text').value;
        websocket.send(message);
    }
    
    function gotoUrl(url) {
    	closeWebSocket();
    	location.href= url;
    }
</script>
</html>