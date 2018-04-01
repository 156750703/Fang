package com.jun.fang.core.model._enum;

/**
 * 成型
 * @author ywj
 *
 */
public enum Forming {

	DADAO(3,"大道"),
	ERDAO(2,"二道"),
	XIE(1,"斜"),
	FANG(1,"方"),
	PILIN(2,"匹林");
	
	private int weight;
	private String describ;
	
	Forming(int weight,String describ){
		this.weight = weight;
		this.describ = describ;
	}

	 

	public int getWeight() {
		return weight;
	} 

	public String getDescrib() {
		return describ;
	}

}
