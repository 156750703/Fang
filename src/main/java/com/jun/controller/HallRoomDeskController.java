package com.jun.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
 















import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.jun.fang.core.model.Player;
import com.jun.model.Desk;
import com.jun.model.Hall;
import com.jun.model.Room;
import com.jun.model.User;
import com.jun.model._enum.Where;

/**
 * 管理用户进入、退出房间桌子等信息
 * @author ywj
 *
 */
@Controller
public class HallRoomDeskController {
	
	private static final String ENTER_HALL = "enterHall";
	private static final String ENTER_ROOM = "enterRoom";
	private static final String ENTER_DESK = "enterDesk";
	
	
	/**
	 * 进入大厅
	 * @return
	 */
	@RequestMapping("/enterHall")
	public String enterHall(HttpServletRequest request,Map<String, Object> map){
		//进入大厅，获取房间信息
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");	
		user.setWhere(Where.HALL);  
		List<Map<String, Object>> roomList = new ArrayList<Map<String,Object>>();
		for(int i=1;i<=Hall.ROOM_COUNT;i++) {
			Map<String, Object> tmap = new HashMap<String, Object>();
			tmap.put("id", "room"+i);
			tmap.put("idx", ""+i);
			tmap.put("value", "房间"+i);
			roomList.add(tmap);
		}
		map.put("roomList", roomList);
		return ENTER_HALL;
	}
	
	/**
	 * 进入房间
	 * @param request
	 * @param roomNo
	 * @return
	 */
	@RequestMapping("/enterRoom")
	public String enterRoom(HttpServletRequest request,Integer roomNo,Map<String, Object> map){
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");	
		user.setRoomNo(roomNo);
		user.setWhere(Where.ROOM);
		
		map.put("roomNo", roomNo);

		Room room = Hall.getRoom(roomNo);
		//1、获取房间总人数 (等于没进桌子的和进桌子的和)
		int notInDesk = room.getConnectors().size();
		
		int sumInDesk = 0;
		for(int i=1;i<=Room.DESK_COUNT;i++) {
			sumInDesk += room.getDesk(i).getConnectors().size();
		}
		map.put("userCount", notInDesk+sumInDesk+1); //这里要+1，是自身，因为自己进房间这时候还没执行websocket连接 ，这时候统计是不计算自己的
		
		//2、获取每个桌子上黑白座位上的人员姓名

		List<Map<String, Object>> deskUsers = new ArrayList<Map<String,Object>>();
		for(int i=1;i<=Room.DESK_COUNT;i++) {
			Desk desk = room.getDesk(i);
			Player blackPlayer = desk.getBlack();
			Player whitePlayer = desk.getWhite();
			Map<String, Object> tMap = new HashMap<String, Object>();
			tMap.put("black", blackPlayer!=null?blackPlayer.getName():" ");
			tMap.put("white", whitePlayer!=null?whitePlayer.getName():" ");
			deskUsers.add(tMap);
		}
		map.put("deskUsers", deskUsers);
		return ENTER_ROOM;
	}
	
	/**
	 * 离开房间，直接返回大厅
	 * @param request
	 * @return
	 */
	@RequestMapping("/leaveRoom")
	public String leaveRoom(HttpServletRequest request){
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");	
		user.setRoomNo(0);
		user.setWhere(Where.HALL);
		return "redirect:"+ENTER_HALL;
	}
	
	/**
	 * 进入桌子，桌子有两个座位，为0和1，分别代表黑方和白方，如果这个座位已经有人了，那么就是观看者
	 * @param deskNo
	 * @param seat
	 * @return
	 */
	@RequestMapping("/enterDesk")
	public String enterDesk(HttpServletRequest request,Integer deskNo,Integer seat){

		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");	
		if(user.getRoomNo()>0) {
			user.setDeskNo(deskNo);
			//进入桌子，生成player，默认是观看者（role=2），然后检查位置是否有人坐下，没有人坐下，就更新role
			Player player = new Player(user.getId(),user.getName(),2);
			Desk desk = getUserDesk(user);
			if(seat==0 && desk.getBlack()== null ) {
				player.setRole(seat);
				desk.setBlack(player);
			} else if(seat==1 && desk.getWhite() == null) {
				player.setRole(seat);
				desk.setWhite(player);
			}
			user.setPlayer(player);
			user.setWhere(Where.DESK);
		}
		
		return ENTER_DESK;
	}
	
	/**
	 * 离开桌子
	 * @param request
	 * @return
	 */
	@RequestMapping("/leaveDesk")
	public String leaveDesk(HttpServletRequest request){
		//这里从session中得到房间号和桌号，离开桌之后要清楚User相应的数据
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");	
		Desk desk = getUserDesk(user);
		int userRole = user.getPlayer().getRole();
		if(userRole == 0) {
			desk.setBlack(null);
		} else if(userRole == 1) {
			desk.setWhite(null);
		}
		user.setDeskNo(0); 
		user.setWhere(Where.ROOM);
		user.setPlayer(null);
		
		//return "forward:"; redirect:test
		return "redirect:enterRoom.do?roomNo="+user.getRoomNo();
	}
	
	/**
	 * 获取user所在的桌
	 * @param user
	 * @return
	 */
	private Desk getUserDesk(User user){
		return Hall.getRoom(user.getRoomNo()).getDesk(user.getDeskNo());
	}
	/**
	 * 获取user所在的房间
	 * @param user
	 * @return
	 */
	private Room getUserRoom(User user){
		return Hall.getRoom(user.getRoomNo());
	}
}
