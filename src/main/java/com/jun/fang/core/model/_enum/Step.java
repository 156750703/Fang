package com.jun.fang.core.model._enum;

public enum Step {

	STEP1(1,"落子阶段"),
	STEP2(2,"吃子阶段"),//（一人吃一个）
	STEP3(3,"走棋阶段"),//（成型可以吃子）
	OVER(4,"结束");
	
	private int step;
	private String describ;
	private Step(int step,String describ) {
		this.step = step;
		this.describ = describ;
	}
	public int getStep() {
		return step;
	}
	public String getDescrib() {
		return describ;
	}
	
}
