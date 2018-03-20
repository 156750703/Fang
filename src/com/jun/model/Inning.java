package com.jun.model;

import java.util.ArrayList;
import java.util.List;

import com.jun.model.Operate.OperateType;
import com.jun.model.enum_.ErrorInfo;
import com.jun.model.enum_.Forming;
import com.jun.model.enum_.Step;
import com.jun.model.enum_.WinOrLose;



public class Inning {

	private long id;//一局棋的id
	private Player black;//黑方
	private Player white;//白方
	
	//棋局状态
	//64位长整型，用50位保存黑白棋子，第一位保存黑的（0，0）位置，第二位保存白的（0，0）位置，第三位保存黑的(0，1)依次类推
	//倒数第一位为1黑方胜利，倒数第二位1白方胜利，倒数第三位1平局
	private long state;
	private Step step;//1 落子阶段，2 吃子阶段（一人吃一个），3走子阶段（成型可以吃子）
	 
	public Inning(long id,Player black,Player white){
		this.id = id;
		this.black = black;
		this.white = white;
		this.state = 0;
		this.step = Step.STEP1;
		this.black.setAbilityAdd(1);//黑方先下
	}
	private boolean isPointInRange(Point point){
		if(point.getX()>=0 && point.getX()<=4 && point.getY()>=0 && point.getY()<=4) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * 落子，成功返回true，否则返回false
	 * @param is
	 * @param points
	 * @return
	 */
	private ErrorInfo add(Point point,Player player){
		if(!isPointInRange(point)){
			return ErrorInfo.OUT_OF_RANGE;
		}
		if(player.getAbilityAdd()>0) {
			long state = this.state;
			int bitPossition =  63- (point.getX()*5+point.getY())*2;
			//判断这里是否有值,没有值，才设置
			if( (state & 0x1L<<bitPossition ) == 0 && (state & 0x1L<<(bitPossition-1) ) == 0){
				state = state | 0x1L<<(bitPossition-player.getRole());
			} else {
				return ErrorInfo.POINT_NOT_EMPTY;
			}	
			this.state = state; 
			show();
			afterAdd(point,player);
			return ErrorInfo.OK;
		}
		return ErrorInfo.NOT_YOUR_TURN_TO_ADD;
	}
	
	/**
	 * 下子之后做处理
	 * @param point
	 * @param player
	 */
	private void afterAdd(Point point,Player player){
		int k=0;
		int l = k;
		if(checkFull()){
			//下满了，就不能下了,设置第一个吃子的人,下最后一个子的人后吃子
			black.setAbilityAdd(0);
			white.setAbilityAdd(0);
			this.step = Step.STEP2;
			if(black == player) {
				white.setAbilityDelete(1);
			} else if(white == player) {
				black.setAbilityDelete(1);
			}
		} else {
			int abilityAdd = player.getAbilityAdd();
			abilityAdd--; 
			//判断最后落的子是否成型，成型的话，加落子能力
			List<FormingInfo> formingInfos = forming(point,player);
			if(formingInfos.size()>0) {
				System.out.println((player.getRole()==0?"黑方":"白方")+"成"+shwoForming(formingInfos));
				for(FormingInfo info : formingInfos) {
					abilityAdd += info.getCount() * info.getForming().getWeight();
				}
			}
			player.setAbilityAdd(abilityAdd); 
			//设置下一个可以落子者 
			if(player.getAbilityAdd() == 0) {
				if(black == player) {
					white.setAbilityAdd(1);
				} else if(white == player) {
					black.setAbilityAdd(1);
				}
			} 
			if(player.getAbilityAdd()>0){
				System.out.println("接下来由"+(player.getRole()==0?"黑方":"白方")+"继续落子，还可以继续落"+player.getAbilityAdd()+"个子");
			} else {
				System.out.println("接下来由"+(player.getRole()==0?"白方":"黑方")+"落子");
			}
		}
	}
	
	/**
	 * 在吃子阶段删除
	 * @param point
	 * @param beExecuted
	 * @return
	 */
	private ErrorInfo eat(Point point,Player beExecuted){
		ErrorInfo errorInfo = delete(point, beExecuted);
		Player operator = (black == beExecuted?white:black);
		if(ErrorInfo.OK == errorInfo) {
			//检查，如果棋谱中只有23个子，说明双方都吃过子了，进入第三个阶段
			int remaining = checkRemaining();
			if(24 == remaining){
				beExecuted.setAbilityDelete(1);
				operator.setAbilityDelete(0);
			} else if(23 == remaining) {
				beExecuted.setAbilityDelete(0);
				operator.setAbilityDelete(0);
				beExecuted.setAbilityMove(1);
				this.step = Step.STEP3;
			}
			return ErrorInfo.OK;
		} else {
			return errorInfo;
		}
	}
	
	/**
	 * 删除一个子
	 * @param point
	 * @param beExecuted
	 * @return
	 */
	public ErrorInfo delete(Point point,Player beExecuted){
		if(!isPointInRange(point)){
			return ErrorInfo.OUT_OF_RANGE;
		}
		Player operator = (black == beExecuted?white:black);
		if(operator.getAbilityDelete()>0) {
			long state = this.state;
			int bitPossition =  63- ((point.getX()*5+point.getY())*2 + beExecuted.getRole());
			//判断这里是否有值,有值，才delete
			if( (state & 0x1L<<bitPossition ) != 0 ){
				state = state & (~(0x1L<<(bitPossition)));
				this.state = state;
				operator.setAbilityDelete(operator.getAbilityDelete()-1);
				//删除一个子后，检查被删除子的一方是否已经没有子了，如果没有子了就结束了，设置Step状态
				if(checkOnePlayerEmpty(beExecuted)) {
					//一个都没有了，设置状态
					if(operator == black){
						setWinner(WinOrLose.BLACKWIN);
					} else if(operator == white) {
						setWinner(WinOrLose.WHITEWIN);
					}
					this.step = Step.OVER;
				}
				return ErrorInfo.OK;
			} else {
				return ErrorInfo.CANNOT_DELETE_EMPTY_POINT;
			}
		} 
		return ErrorInfo.NOT_YOUR_TURN_TO_DELETE;
	}
	
	/**
	 * 移动一个棋子
	 * @param from
	 * @param to
	 * @param operator
	 * @return
	 */
	private ErrorInfo move(Point from,Point to,Player operator){
		//先检查某一方是否有吃子能力
		if(black.getAbilityDelete()>0 || white.getAbilityDelete()>0) {
			if(operator.getAbilityDelete()>0) {
				return ErrorInfo.IT_IS_YOUR_TURN_TO_DELETE;
			} else {
				return ErrorInfo.NOT_YOUR_TURN_TO_MOVE;
			}
		}
		//检查自己是否当前有移动能力
		if(operator.getAbilityMove()<1) {
			return ErrorInfo.NOT_YOUR_TURN_TO_MOVE;
		}
		Player other = (black == operator?white:black);
		//检查自己from有子，且双方to没子
		if(haveChessman(from,operator) && !haveChessman(to,operator) && !haveChessman(to,other)) {
			 
			int fromPossition =  63- ((from.getX()*5+from.getY())*2 + operator.getRole());
			int toPossition =  63- ((to.getX()*5+to.getY())*2 + operator.getRole());
			long state = this.state;
			state = state & (~(0x1L<<(fromPossition)));
			state = state | 0x1L<<(toPossition);
			this.state = state;
			operator.setAbilityMove(0);
			other.setAbilityMove(1);
			//移动后成型，增加吃子能力
			List<FormingInfo> formingInfos = forming(to,operator);
			if(formingInfos.size()>0) {
				//System.out.println((operator.getRole()==0?"黑方":"白方")+"成"+shwoForming(formingInfos));
				int abilityDelete = 0;
				for(FormingInfo info : formingInfos) {
					abilityDelete += info.getCount() * info.getForming().getWeight();
				}
				operator.setAbilityDelete(abilityDelete);
			}
			return ErrorInfo.OK;
		} else {
			return ErrorInfo.MAKESURE_MOVEING_FROM_AND_TO;
		}
	}
	 
	
	public String shwoForming(List<FormingInfo> formingInfos){
		StringBuilder sb = new StringBuilder();
		boolean first = true;
		for(FormingInfo info : formingInfos) {
			if(!first) {
				sb.append("加");
			} else {
				first = false;
			}
			switch (info.getCount()) {
			case 4:
				sb.append("四个");
				break;
			case 3:
				sb.append("三个");
				break;
			case 2:
				sb.append("双");
				break;
			case 1:
				sb.append("一");
				break; 
			default:
				break;
			}
			sb.append(info.getForming().getDescrib());
		}
		return sb.toString();
	}
	
	/**
	 * 判断最后落子或移动是否成型,如果成型，返回成型对应的能力数
	 * 大道3，二道2，匹林2，方1，斜1
	 * @param point
	 * @param player
	 * @return
	 */
	private List<FormingInfo> forming(Point point,Player player){
		List<FormingInfo> ret = new ArrayList<FormingInfo>();
		if(!haveChessman(point,player)){
			return ret;
		} 
		//是否成大道 
		FormingInfo formingDadao = formingDaDao(point,player);
		if(formingDadao != null) {
			ret.add(formingDadao);
		} 
		
		//是否成二道
		FormingInfo formingErdao = formingErDao(point,player);
		if(formingErdao != null) {
			ret.add(formingErdao);
		}
		 
		//是否成小斜
		FormingInfo formingXie = formingXie(point,player);
		if(formingXie != null) {
			ret.add(formingXie);
		}
		
		//是否成方
		FormingInfo formingFang = formingFang(point,player);
		if(formingFang != null) {
			ret.add(formingFang);
		} 
		
		//是否成匹林 
		FormingInfo formingPiLin = formingPiLin(point,player);
		if(formingPiLin != null) {
			ret.add(formingPiLin);
		}
		return ret;
	}
	
	/**
	 * 是否成大道，成一个返回3，成两个返回6，不成返回0
	 * @param point
	 * @param player
	 * @return
	 */
	private FormingInfo formingDaDao(Point point,Player player){
		int count = 0;
		if(point.getX() == point.getY()) {
			int num = 0;
			for(int i=0;i<5;i++) {
				if(point.getX() !=i){
					if(haveChessman(new Point(i, i),player)) {
						num++;
					} else {
						break;
					}
				}
			}
			if(num==4){
				count++;
			}
		}
		if(point.getX()==0 && point.getY()==4 ||
				point.getX()==1 && point.getY()==3 ||
				point.getX()==2 && point.getY()==2 ||
				point.getX()==3 && point.getY()==1 ||
				point.getX()==4 && point.getY()==0 ){
			int num = 0;
			for(int i=0;i<5;i++) {
				if(point.getX() !=i){
					if(haveChessman(new Point(i, 4-i),player)) {
						num++;
					} else {
						break;
					}
				}
			}
			if(num==4){
				count++;
			}			
		}
		
		return count==0?null: new FormingInfo(Forming.DADAO,count);
	}
	
	/**
	 * 是否成二道
	 * @param point
	 * @param player
	 * @return
	 */
	private FormingInfo formingErDao(Point point,Player player){
		int count = 0;
		if(point.getX() + point.getY() == 3  && 
				haveChessman(new Point(0, 3),player) &&
				haveChessman(new Point(1, 2),player) &&
				haveChessman(new Point(2, 1),player) &&
				haveChessman(new Point(3, 0),player)){
			count++;
		} else if( point.getX() + point.getY() ==5 && 
				haveChessman(new Point(1, 4),player) &&
				haveChessman(new Point(2, 3),player) &&
				haveChessman(new Point(3, 2),player) &&
				haveChessman(new Point(4, 1),player)){
			count++;
		}  
		if(point.getX() - 1 == point.getY() && 
				haveChessman(new Point(1, 0),player) &&
				haveChessman(new Point(2, 1),player) &&
				haveChessman(new Point(3, 2),player) &&
				haveChessman(new Point(4, 3),player)){
			count++;
		} else if(point.getX() + 1 == point.getY() && 
				haveChessman(new Point(0, 1),player) &&
				haveChessman(new Point(1, 2),player) &&
				haveChessman(new Point(2, 3),player) &&
				haveChessman(new Point(3, 4),player)){
			count++;
		}
		return count==0?null:new FormingInfo(Forming.ERDAO,count);
	}
	/**
	 * 是否成斜
	 * @param point
	 * @param player
	 * @return
	 */
	private FormingInfo formingXie(Point point,Player player){
		int count = 0;
		if(point.getX() == 2 && point.getY() == 0) {
			if(haveChessman(new Point(1, 1),player) && haveChessman(new Point(0, 2),player)) {
				count++;
			}
			if(haveChessman(new Point(3, 1),player) && haveChessman(new Point(4, 2),player)) {
				count++;
			}
		} else if(point.getX() == 0 && point.getY() == 2) {
			if(haveChessman(new Point(1, 1),player) && haveChessman(new Point(2, 0),player)) {
				count++;
			}
			if(haveChessman(new Point(1, 3),player) && haveChessman(new Point(2, 4),player)) {
				count++;
			}
		} else if(point.getX() == 2 && point.getY() == 4) {
			if(haveChessman(new Point(0, 2),player) && haveChessman(new Point(1, 3),player)) {
				count++;
			}
			if(haveChessman(new Point(4, 2),player) && haveChessman(new Point(3, 3),player)) {
				count++;
			}
		} else if(point.getX() == 4 && point.getY() == 2) {
			if(haveChessman(new Point(2, 0),player) && haveChessman(new Point(3, 1),player)) {
				count++;
			}
			if(haveChessman(new Point(3, 3),player) && haveChessman(new Point(2, 4),player)) {
				count++;
			}
		} else if(point.getX() == 1 && point.getY() == 1) {
			if(haveChessman(new Point(2, 0),player) && haveChessman(new Point(0, 2),player)) {
				count++;
			}
		} else if(point.getX() == 1 && point.getY() == 3) {
			if(haveChessman(new Point(0, 2),player) && haveChessman(new Point(2, 4),player)) {
				count++;
			}
		} else if(point.getX() == 3 && point.getY() == 1) {
			if(haveChessman(new Point(2, 0),player) && haveChessman(new Point(4, 2),player)) {
				count++;
			}
		} else if(point.getX() == 3 && point.getY() == 3) {
			if(haveChessman(new Point(4, 2),player) && haveChessman(new Point(2, 4),player)) {
				count++;
			}
		}
		return count==0?null:new FormingInfo(Forming.XIE,count);
	}
	
	/**
	 * 是否成方
	 * @param point
	 * @param player
	 * @return
	 */
	private FormingInfo formingFang(Point point,Player player){
		int count = 0; 
		//左上
		if(point.getX()>0 && point.getY()>0) {
			if(haveChessman(new Point(point.getX()-1, point.getY()-1),player) &&
					haveChessman(new Point(point.getX(), point.getY()-1),player) &&
					haveChessman(new Point(point.getX()-1, point.getY()),player)
					){
				count++;
			}
		} 
		//左下
		if(point.getX()<4 && point.getY()>0) {
			if(haveChessman(new Point(point.getX(), point.getY()-1),player) &&
					haveChessman(new Point(point.getX()+1, point.getY()-1),player) &&
					haveChessman(new Point(point.getX()+1, point.getY()),player)
					){
				count++;
			}
		}
		//右上
		if(point.getX()>0 && point.getY()<4) {
			if(haveChessman(new Point(point.getX()-1, point.getY()),player) &&
					haveChessman(new Point(point.getX()-1, point.getY()+1),player) &&
					haveChessman(new Point(point.getX(), point.getY()+1),player)
					){
				count++;
			}
		}
		//右下
		if(point.getX()<4 && point.getY()<4) {
			if(haveChessman(new Point(point.getX(), point.getY()+1),player) &&
					haveChessman(new Point(point.getX()+1, point.getY()),player) &&
					haveChessman(new Point(point.getX()+1, point.getY()+1),player)
					){
				count++;
			}
		}
		return count==0?null:new FormingInfo(Forming.FANG,count);
	}
	
	/**
	 * 是否成匹林
	 * @param point
	 * @param player
	 * @return
	 */
	private FormingInfo formingPiLin(Point point,Player player){
		int count = 0;
		int num = 0;
		for(int i=0;i<5;i++){
			if(point.getY() !=i){
				if(haveChessman(new Point(point.getX(), i),player)){
					num++;
				} else {
					break;
				}
			}
		}
		if(num==4){
			count++;
		}
		
		num = 0;
		for(int i=0;i<5;i++){
			if(point.getX() !=i){
				if(haveChessman(new Point(i, point.getY()),player)){
					num++;
				} else {
					break;
				}
			}
		}
		if(num==4){
			count++;
		}
		return count==0?null:new FormingInfo(Forming.PILIN,count);
	}
	
	
	
	/**
	 * 某个位置是否有某个player的棋子
	 * @param point
	 * @param player
	 * @return
	 */
	private boolean haveChessman(Point point,Player player){
//		int bitPossition = 63 - (point.getX()*5+point.getY())*2;
//		if(black == player && (state  & 0x1L<<bitPossition) != 0
//				|| white == player && (state  & 0x1L<<--bitPossition ) != 0) {
//				return true;
//		}
		int bitPossition = 63 - ( (point.getX()*5+point.getY())*2+player.getRole() );
		if( (state  & 0x1L<<bitPossition) != 0) {
			return true;
		}
		return false;
	}
	
	/**
	 * 检查是否下满 了,满 了返回true，否则返回false
	 * @return
	 */
	private boolean checkFull(){
		for(int i=0;i<25;i++) {
			int bitPossition =  62 - i*2;
			long value = 0x3L<<bitPossition;
			value = this.state & value;
			if( value == 0 ){
				return false;
			}
		}
		return true;
	}
	/**
	 * 检查棋盘上还有多少子(包含双方的)
	 * @return
	 */
	private int checkRemaining(){
		int ret = 0;
		for(int i=0;i<25;i++) {
			int bitPossition =  62 - i*2;
			if( (this.state & 0x3L<<bitPossition) != 0 ){
				ret++;
			}
		}
		return ret;
	}
	/**
	 * 检查一方是否为空了
	 * @return
	 */
	private boolean checkOnePlayerEmpty(Player beExecuted){
		boolean empty = true;
		for(int i=0;i<25;i++) {
			int bitPossition =  63 - (i*2 + beExecuted.getRole());
			if( (this.state & 0x1L<<bitPossition) != 0 ){
				empty = false;
				break;
			}
		} 
		return empty;
	}
	
	/**
	 * 获取一局的状态：0、正在进行；1、黑方胜；2、白方胜；3、平局 
	 * @return
	 */
	public WinOrLose getWinner(){
		int status = (int)this.state & 7;
		switch (status) {
		case 0:
			return WinOrLose.PLAYING;
		case 1:
			return WinOrLose.BLACKWIN;
		case 2:
			return WinOrLose.WHITEWIN;
		case 4:
			return WinOrLose.DOGFALL;
		default:
			return WinOrLose.PLAYING;
		}
	}
	
	/**
	 * 设置输赢结果
	 * @param winOrLose
	 * @return
	 */
	private boolean setWinner(WinOrLose winOrLose){
		switch (winOrLose) {
		case BLACKWIN:
			this.state = this.state | 1;
			break;
		case WHITEWIN:
			this.state = this.state | 2;
			break;
		case DOGFALL:
			this.state = this.state | 4;
			break;
		default:
			break;
		}
		return true;
	}
	
	/**
	 * 获取一局的状态，返回文字描述
	 * @return
	 */
	public String getWinnerDescrib(){
		return getWinner().getDescrib();
	}
	
	public long getId() {
		return id;
	}
	
	public Player getBlack() {
		return black;
	}
	
	public Player getWhite() {
		return white;
	}
	
	public Step getStep() {
		return step;
	}
	/**
	 * 作为测试用，显示布局
	 */
	public void show(){
		System.out.println("**********************************");
		long state = this.state;
		
		for(int x=0;x<5;x++) {
			for(int y=0;y<5;y++) {
				int bitPossition = 63 - (x*5+y)*2;
				String showStr = "--";
				if( (state  & 0x1L<<bitPossition) != 0 ){
					showStr = "黑 ";
				} 
				bitPossition--;
				if( (state  & 0x1L<<bitPossition ) != 0 ){
					showStr = "白 ";
				}
				System.out.print(showStr);
			}
			System.out.println("");
		}
		System.out.println("**********************************");
	}
	
	public ErrorInfo process(Operate operate){
		ErrorInfo ret = ErrorInfo.UNKNOWN_ERROR; 
		switch (this.getStep()) {
		case STEP1:
			if(OperateType.ADD == operate.getOperateType()) {
				ret = add(operate.getWhere(), operate.getTargetPlayer());
			}
			break;
		case STEP2:
			if(OperateType.DELETE == operate.getOperateType()) {
				ret = eat(operate.getWhere(), operate.getTargetPlayer());
			}
			break;
		case STEP3:
			if(OperateType.DELETE == operate.getOperateType()) {
				ret = delete(operate.getWhere(), operate.getTargetPlayer());
			} else if(OperateType.MOVE == operate.getOperateType()){
				ret = move(operate.getWhere(), operate.getTo(), operate.getTargetPlayer());
			}
			break;
		case OVER:
			ret = ErrorInfo.GAME_IS_OVER;
			break;
		default:
			break;
		}
		return ret;
	}
}
