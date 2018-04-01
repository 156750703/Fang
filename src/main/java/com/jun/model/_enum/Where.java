package com.jun.model._enum;

public enum Where {

	HALL(1,"大厅"),
	ROOM(2,"房间"),
	DESK(3,"桌子");
	
	private int value;
	private String describ;
	
	private Where(int value,String describ){
		this.value = value;
		this.describ = describ;
	}
	
	
}
