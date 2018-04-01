package com.jun.fang.core.model;


public class Operate {

	public static enum OperateType {
		ADD,DELETE,MOVE
	}
	private OperateType operateType;
	private Player targetPlayer;
	private Point where;
	private Point to;

	public Operate(OperateType operateType,Player targetPlayer,Point... points){
		this.operateType = operateType;
		this.targetPlayer = targetPlayer;
		this.where = points[0];
		if(points.length>1){
			this.to = points[1];
		}
	}

	public OperateType getOperateType() {
		return operateType;
	}

	public void setOperateType(OperateType operateType) {
		this.operateType = operateType;
	}

	 

	public Player getTargetPlayer() {
		return targetPlayer;
	}

	public void setTargetPlayer(Player targetPlayer) {
		this.targetPlayer = targetPlayer;
	}

	public Point getWhere() {
		return where;
	}

	public void setWhere(Point where) {
		this.where = where;
	}

	public Point getTo() {
		return to;
	}

	public void setTo(Point to) {
		this.to = to;
	}
	
	
	
}
