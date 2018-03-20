package com.jun.model.enum_;


public enum ErrorInfo {

	OK(0,"OK"),
	OUT_OF_RANGE(1,"不在范围内，请在棋谱上操作好不好"),
	POINT_NOT_EMPTY(2,"这个位置已经有子了"),
	NOT_YOUR_TURN_TO_ADD(3,"当前不该你下子"),
	NOT_YOUR_TURN_TO_DELETE(4,"当前不该你吃子"),
	NOT_YOUR_TURN_TO_MOVE(5,"当前不该你走子"),
	MAKESURE_MOVEING_FROM_AND_TO(6,"请确认你出发点有子，并且目标点无子"), 
	IT_IS_YOUR_TURN_TO_DELETE(7,"当前该你吃子"), 
	CANNOT_DELETE_EMPTY_POINT(8,"这里没有子，不能删除"),
	
	
	GAME_IS_OVER(9,"游戏已经结束，请再来一局!"),
	UNKNOWN_ERROR(10,"程序发生未知异常，请稍后重试");
	
	
	private int code;
	private String describ;
	
	private ErrorInfo(int code,String describ) {
		this.code = code;
		this.describ = describ;
	}

	public int getCode() {
		return code;
	}

	public String getDescrib() {
		return describ;
	}
	
	
}
