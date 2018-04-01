package com.jun.fang.core.model;

public class Player {

	private long id;
	private int role;//0 黑方  1白方 ,2观看者
	private String name;
	private int abilityAdd = 0;//还能下几颗
	private int abilityDelete = 0;//还能吃几颗
	private int abilityMove = 0;//还能走几步 ，最多走一步，默认0不能走
	public Player(){
		role = 2;//默认是观看者
	}
	
	public Player(long id, String name,int role) {
		super();
		try {
			if(role<0 || role >2) {
				throw new Exception("用户角色设置不正确");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		this.id = id;
		this.name = name;
		this.role = role;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public int getRole() {
		return role;
	}
	public void setRole(int role) {
		this.role = role;
	}

	public int getAbilityAdd() {
		return abilityAdd;
	}

	public void setAbilityAdd(int abilityAdd) {
		this.abilityAdd = abilityAdd;
	}

	public int getAbilityDelete() {
		return abilityDelete;
	}

	public void setAbilityDelete(int abilityDelete) {
		this.abilityDelete = abilityDelete;
	}

	public int getAbilityMove() {
		return abilityMove;
	}

	public void setAbilityMove(int abilityMove) {
		this.abilityMove = abilityMove;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	} 
	
	
	
}
