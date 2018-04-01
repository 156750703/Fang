package com.jun.model;

import java.util.ArrayList;
import java.util.List;

import com.jun.config.WebSocketConnector;
import com.jun.fang.core.model.Player;

public class Desk {

	
	private List<WebSocketConnector> connectors = new ArrayList<WebSocketConnector>();

	private Player black; //黑色选手
	private Player white; //白色选手
	
	private int deskNo;
	public Desk(int deskNo){
		this.deskNo = deskNo;
	}
	
	
	public List<WebSocketConnector> getConnectors() {
		return connectors;
	}
	public Player getBlack() {
		return black;
	}
	public void setBlack(Player black) {
		this.black = black;
	}
	public Player getWhite() {
		return white;
	}
	public void setWhite(Player white) {
		this.white = white;
	}
	public int getDeskNo() {
		return deskNo;
	}
	public void setDeskNo(int deskNo) {
		this.deskNo = deskNo;
	}
	
	
}
