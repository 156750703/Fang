package com.jun.model;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import com.jun.config.WebSocketConnector;



public class Room {

	public static final int PLAYER_LIMIT = 50; //一个房间最多有50人
	public static final int DESK_COUNT = 20;   //一个房间只有20桌
	 

	//当前在这个房间的连接 如果退出房间或者进入某一桌了，就从这里删除
	private List<WebSocketConnector> connectors = new ArrayList<WebSocketConnector>();

	
	//房间的桌子
	private ConcurrentHashMap<Integer,Desk> desks = new ConcurrentHashMap<Integer,Desk>();

	
	private int roomNo; // 房间号

	public Room(int roomNo) {
		this.roomNo = roomNo;
		//默认一个房间只能有20人
		for(int i=1;i<=DESK_COUNT;i++) {
			desks.put(i, new Desk(i));
		}
	}
	public Desk getDesk(int i) {
    	return this.desks.get(i);
    }

	public List<WebSocketConnector> getConnectors() {
		return connectors;
	}
	
}
