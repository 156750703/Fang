package com.jun.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicLong;

import javax.servlet.http.HttpSession;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.tomcat.util.collections.ConcurrentCache;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;

import com.jun.config.Consts;
import com.jun.config.GetHttpSessionConfigurator;
import com.jun.config.WebSocketConnector;
 

/**
 * websocket服务类
 * websocket的具体实现类 
 * @author  ywj 
 * @version 1.0
 */
public class Hall {
	
	public static final int ROOM_COUNT = 5;
	
	//大厅房间数
    private ConcurrentHashMap<Integer,Room> rooms = new ConcurrentHashMap<Integer,Room>();
    
    //当前在这个房间的连接 如果退出房间或者进入某一桌了，就从这里删除
  	private List<WebSocketConnector> connectors = new ArrayList<WebSocketConnector>();

    private static Hall instance = new Hall();
    
    private Hall(){
    	for(int i=1;i<=ROOM_COUNT;i++) {
    		rooms.put(i, new Room(i));
    	}
    }
    public static Room getRoom(int i) {
    	return instance.rooms.get(i);
    }
	public static List<WebSocketConnector> getConnectors() {
		return instance.connectors;
	}
    
}
