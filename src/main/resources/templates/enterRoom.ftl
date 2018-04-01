<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>房间</title>
<script type="text/javascript" src="/js/jquery-2.2.0.min.js"></script>
<style>
.blackSeat{
	width:60px;height:25px;border:solid 1px #000;background-color:#606060;margin-left:auto;margin-right:auto; 
}
.whiteSeat{
	width:60px;height:25px;border:solid 1px #000;background-color:#dadada;margin-left:auto;margin-right:auto; 
}
.deskStyle{
	width:90px;height:60px;border:solid 1px #000;background-color:#3f7d2f;margin-left:auto;
	margin-right:auto;text-align: center;font-size:30px;line-height:60px;
}
.deskSpace {
	width:100px;height:116px;border:1px solid #638f69;float:left;margin-left:30px;margin-top:30px;
}
</style>
</head>
<body>
<font color="blue">  ${Session.user.name!"游客"} </font> ,欢迎您进入房间${roomNo},房间人数${userCount} ，请选择桌位
<div style="width:700px;">
	<#list deskUsers as deskUser>
		<div class="deskSpace" deskCode="${deskUser_index+1}">
			<div class="blackSeat"><font color="blue">${deskUser.black}</font></div>
			<div class="deskStyle">${deskUser_index+1}桌</div>
			<div class="whiteSeat"><font color="blue">${deskUser.white}</font></div>
		</div>
	</#list>
	
	<div style="width:500px;float:left;margin-top:30px;margin-left:30px;">
		<button onclick="leaveRoom()">离开房间</button>
	</div>
</div>
 
 
<br/><br/><br/><br/><br/><br/>


<div id="message">
</div>
</body>
<script type="text/javascript">
$(function(){
	$(".blackSeat").click(function(){
		let deskCode = $(this).parent().attr("deskCode");
		gotoUrl("/enterDesk.do?deskNo="+deskCode+"&seat=0");
	});
	$(".whiteSeat").click(function(){
		let deskCode = $(this).parent().attr("deskCode");
		gotoUrl("/enterDesk.do?deskNo="+deskCode+"&seat=1");
	});
});

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
        //gotoUrl("/index.html");
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
    function leaveRoom(){
    	gotoUrl("/leaveRoom.do");
    }
    
    function gotoUrl(url) {
    	closeWebSocket();
    	location.href= url;
    }
</script>
</html>