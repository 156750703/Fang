package com.jun.fang.core.model._enum;

public enum WinOrLose {

	PLAYING(0,"正在进行"),
	BLACKWIN(1,"黑方胜利"),
	WHITEWIN(2,"白方胜利"),
	DOGFALL(3,"平局");

	private int status;
	private String describ;
	
	private WinOrLose(int status,String describ) {
		this.status = status;
		this.describ = describ;
	}
	public int getStatus() {
		return status;
	}
	public String getDescrib() {
		return describ;
	}
	
}
