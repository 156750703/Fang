package com.jun.fang.core.model;

import com.jun.fang.core.model._enum.Forming;

public class FormingInfo {
	
	Forming forming;
	private int count;
	
	public FormingInfo(){
		
	}
	public FormingInfo(Forming forming,int count){
		this.forming = forming;
		this.count = count;
	}
	
	public Forming getForming() {
		return forming;
	}
	public void setForming(Forming forming) {
		this.forming = forming;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	} 
	
	
}
