package com.jun.fang.core.model;

import com.jun.fang.core.model.Operate.OperateType;
import com.jun.fang.core.model._enum.Step;



public class Main2 {

	
	public static Point[] points = {
		new Point(0, 0),new Point(0, 4),
		new Point(1, 0),new Point(1, 4),
		new Point(2, 0),new Point(2, 4),
		new Point(3, 0),new Point(3, 4),
		new Point(4, 0),
		new Point(0, 1),
		new Point(1, 1),
		new Point(0, 2),
		new Point(4, 2),
						new Point(4, 4),
						new Point(4, 3),
						new Point(3, 3),
						new Point(3, 1),
		new Point(1, 2),
		new Point(2, 1),
		new Point(0, 3),
		new Point(1, 3),
		new Point(2, 2),
		new Point(2, 3),
		new Point(3, 2),
		new Point(4, 1),
		//吃子
					    new Point(4, 2),
		new Point(4, 4),
		new Point(4, 3),new Point(4, 4),
						new Point(0, 3),
						new Point(1, 3),
		new Point(0, 2),
		new Point(0, 3),
		new Point(3, 1),
		new Point(3, 3),
						new Point(4, 4),
						new Point(4, 3),
		new Point(3, 2),
		new Point(3, 1),
		new Point(0, 4),
		new Point(1, 4),
		new Point(2, 4),
		new Point(3, 4),
						new Point(4, 3),
						new Point(4, 4),
		new Point(0, 3),
		new Point(1, 3),
		new Point(4, 4)
						
	};
	 
	public static void main(String[] args) {
		Player black = new Player(1,"黑先生",0);
		Player white = new Player(2,"白先生",1);
		Inning inning = new Inning(1,black,white);
		 
		System.out.println("开局，由黑方先落子");
		while(true) {
			Point point = getPoint();
			if(black.getAbilityAdd()>0){
				inning.process(new Operate(OperateType.ADD, black, point ));
			} else if(white.getAbilityAdd()>0){
				inning.process(new Operate(OperateType.ADD, white, point));
			} 
			if(inning.getStep() == Step.STEP2) {
				break;
			}
		}
		//吃子
		System.out.println("已经下完，进入下一步，吃子");
		Point point = getPoint();
		if(black.getAbilityDelete()>0) {
			//黑子吃掉的是白子的相应位置子
			inning.process(new Operate(OperateType.DELETE, white, point));
		} else if(white.getAbilityDelete()>0){
			inning.process(new Operate(OperateType.DELETE, black, point));
		} 
		inning.show();
		point = getPoint();
		if(black.getAbilityDelete()>0) {
			inning.process(new Operate(OperateType.DELETE, white, point));
		} else if(white.getAbilityDelete()>0){
			inning.process(new Operate(OperateType.DELETE, black, point));
		} 
		inning.show();
		System.out.println("吃子结束，该走了,Moving....");
		 
		inning.process(new Operate(OperateType.MOVE, white, getPoint(),getPoint()));
		inning.show();
		 
		inning.process(new Operate(OperateType.DELETE, black, getPoint()));
		inning.process(new Operate(OperateType.DELETE, black, getPoint()));
		inning.show();
		 
		inning.process(new Operate(OperateType.MOVE, black, getPoint(),getPoint()));
		inning.show();
		
		inning.process(new Operate(OperateType.DELETE, white, getPoint()));
		inning.process(new Operate(OperateType.DELETE, white, getPoint()));
		inning.show();
		
		inning.process(new Operate(OperateType.MOVE, white, getPoint(),getPoint()));
		inning.show();
		
		inning.process(new Operate(OperateType.MOVE, black, getPoint(),getPoint()));
		inning.show();
		
		inning.process(new Operate(OperateType.DELETE, white, getPoint()));
		inning.process(new Operate(OperateType.DELETE, white, getPoint()));
		inning.process(new Operate(OperateType.DELETE, white, getPoint()));
		inning.process(new Operate(OperateType.DELETE, white, getPoint()));
		inning.show();
		
		inning.process(new Operate(OperateType.MOVE, white, getPoint(),getPoint()));
		inning.show();
		
		inning.process(new Operate(OperateType.MOVE, black, getPoint(),getPoint()));
		inning.show();
		inning.process(new Operate(OperateType.DELETE, white, getPoint()));
		inning.show();
	}
	
	public static int pointIndex = 0;
	public static Point getPoint(){
		if(pointIndex<points.length){
			return points[pointIndex++];
		}
		return null;
	}

}
