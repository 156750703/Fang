package com.jun.model;

import com.jun.fang.core.model.Player;
import com.jun.model._enum.Where;

public class User {
	
	private long id;
	private String name;
	
	private int roomNo;
	private int deskNo;
	private Player player;
	private Where where;   //为了在大厅，房间，桌之间方便控制，加上一个user目前在哪里的标记  1 大厅 ，2房间  ， 3 桌子 
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Player getPlayer() {
		return player;
	}
	public void setPlayer(Player player) {
		this.player = player;
	}
	public int getRoomNo() {
		return roomNo;
	}
	public void setRoomNo(int roomNo) {
		this.roomNo = roomNo;
	}
	public int getDeskNo() {
		return deskNo;
	}
	public void setDeskNo(int deskNo) {
		this.deskNo = deskNo;
	}
	public Where getWhere() {
		return where;
	}
	public void setWhere(Where where) {
		this.where = where;
	}
	
	
	
	
}
