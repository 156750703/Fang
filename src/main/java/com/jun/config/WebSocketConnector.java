package com.jun.config;

import java.io.IOException;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionContext;
import javax.websocket.EndpointConfig;
import javax.websocket.HandshakeResponse;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpoint;
  




import javax.websocket.server.ServerEndpointConfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.jun.model.Hall;
import com.jun.model.User;
import com.jun.model._enum.Where;

@ServerEndpoint(value = "/websocket" , configurator = GetHttpSessionConfigurator.class)
@Component
public class WebSocketConnector{
	
	// 与某个客户端的连接会话，需要通过它来给客户端发送数据
	private Session session;

	private EndpointConfig config;


	/**
	 * 连接建立成功调用的方法
	 */
	@OnOpen
	public void onOpen(Session session, EndpointConfig config) {
		this.config = config;
		this.session = session;
		User user = getUser();
		int roomNo = user.getRoomNo();
		int deskNo = user.getDeskNo();
//		int role = user.getPlayer().getRole();
//		System.out.println("onOpen===============");
		if (roomNo > 0) {
			if (deskNo > 0) {
				// 进入桌子
				Hall.getRoom(roomNo).getDesk(deskNo).getConnectors().add(this);
				//告知房间所有人这个桌子的人数变动
				sendRoomMessage(getDeskUserCountMessage(), roomNo);
			} else {
				// 进入房间
				Hall.getRoom(roomNo).getConnectors().add(this);
				//告知大厅所有人这个房间的人数变动
				sendHallMessage(getRoomUserCountMessage());
			}
		} else {
			//这是进入了大厅
			Hall.getConnectors().add(this);
		}

	}

	/**
	 * 连接关闭调用的方法
	 */
	@OnClose
	public void onClose() {
//		System.out.println("onClose===============");
		User user = getUser();
		int roomNo = user.getRoomNo();
		int deskNo = user.getDeskNo();
//		int role = user.getPlayer().getRole();

		if (roomNo > 0) {
			if (deskNo > 0) {
				// 离开桌子
				Hall.getRoom(roomNo).getDesk(deskNo).getConnectors()
						.remove(this);
				//告知房间所有人这个桌子的人数变动
				sendRoomMessage(getDeskUserCountMessage(), roomNo);
				 
			} else {
				// 离开房间
				Hall.getRoom(roomNo).getConnectors().remove(this);
				
				//告知大厅所有人这个房间的人数变动
				sendHallMessage(getRoomUserCountMessage());
				
				//离开房间有可能是去了桌子，所以判断user所在位置，是去大厅的话设置roomNo为0
				if(user.getWhere() == Where.HALL) {
					//这个要放在上面通知之后
					user.setRoomNo(0);
				}
			}
		} else {
			//这是离开了大厅
			Hall.getConnectors().remove(this);
		}
	}

	/**
	 * 收到客户端消息后调用的方法
	 * 
	 * @param message
	 *            客户端发送过来的消息
	 */
	@OnMessage
	public void onMessage(String message, Session session) {

		User user = getUser();
		int roomNo = user.getRoomNo();
		int deskNo = user.getDeskNo();
//		int role = user.getPlayer().getRole();

		//处理message
		
		
		//生成返回信息
		String responseMessage = "";
		
		
		if (roomNo > 0) {
			if (deskNo > 0) {
				// 在某一桌子上
				sendDeskMessage(responseMessage,roomNo,deskNo);
			} else {
				// 在某个房间
				sendRoomMessage(responseMessage, roomNo);
			}
		}
	}

	/**
	 * 发生错误时调用
	 */
	@OnError
	public void onError(Session session, Throwable error) {
		System.out.println("发生错误");
		error.printStackTrace();
	}

	public void sendMessage(String message) throws IOException {
		this.session.getBasicRemote().sendText(message);
		// this.session.getAsyncRemote().sendText(message);
	}

	private User getUser(){
		HttpSession httpSession = (HttpSession) config.getUserProperties().get(
				Consts.STRING_HTTP_SESSION);
		return (User) httpSession.getAttribute("user");
	}
	

	

	/**
	 * 给大厅所有人发消息 （当一个人进入房间，那么他就不在大厅里了）
	 * @param message
	 * @param roomNo
	 */
	private void sendHallMessage(String message) {
		List<WebSocketConnector> connectors = Hall.getConnectors();
		sendMessage(message, connectors);
	}
	/**
	 * 房间里所有人发消息（如果一个人进入某桌，就不属于房间了）
	 * @param message
	 * @param roomNo
	 */
	private void sendRoomMessage(String message, int roomNo) {
		List<WebSocketConnector> connectors = Hall.getRoom(roomNo)
				.getConnectors();
		sendMessage(message, connectors);
	}

	/**
	 * 给某一桌的人发消息
	 * @param message
	 * @param roomNo
	 * @param deskNo
	 */
	private void sendDeskMessage(String message, int roomNo, int deskNo) {
		List<WebSocketConnector> connectors = Hall.getRoom(roomNo)
				.getDesk(deskNo).getConnectors();

		sendMessage(message, connectors);

	}
	
	/**
	 * 给某一组人发消息
	 * @param message
	 * @param connectors
	 */
	private void sendMessage(String message, List<WebSocketConnector> connectors) {
		connectors.forEach(coon -> {
			try {
				coon.getSession().getBasicRemote().sendText(message);
			} catch (Exception e) {
			}
		});
	}

	public Session getSession() {
		return session;
	}

	public void setSession(Session session) {
		this.session = session;
	}

	
	private String getRoomUserCountMessage(){
		User user = getUser();
		int roomCount = Hall.getRoom(user.getRoomNo()).getConnectors().size();
		JSONObject json = new JSONObject();
		json.put("roomNo", user.getRoomNo());
		json.put("userCount", roomCount);
		return json.toJSONString();
	}
	private String getDeskUserCountMessage(){
		User user = getUser();
		int roomCount = Hall.getRoom(user.getRoomNo()).getDesk(user.getDeskNo()).getConnectors().size();
		JSONObject json = new JSONObject();
		json.put("deskNo", user.getDeskNo());
		json.put("userCount", roomCount);
		return json.toJSONString();
	}

}
