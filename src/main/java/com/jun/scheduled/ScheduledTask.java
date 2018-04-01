package com.jun.scheduled;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.jun.model.Desk;
import com.jun.model.Hall;
import com.jun.model.Room;

@Component
public class ScheduledTask {
	 
	
	@Scheduled(fixedRate=3000)
	public void repeatCurrentTime() {
		StringBuffer sb = new StringBuffer();
		for(int i=1;i<=Hall.ROOM_COUNT;i++){
			Room room = Hall.getRoom(i);
			sb.append("当前在房间"+i+"的人数:"+room.getConnectors().size());
			sb.append(" 分桌情况:");
			for(int j=1;j<= Room.DESK_COUNT;j++) {
				Desk desk = room.getDesk(j);
				sb.append("【D"+j+": "+desk.getConnectors().size()+"】      ");
			}
			sb.append("\r\n");
		}
		sb.append("========================================================\r\n");
		System.out.println(sb.toString());
		
	}
	
}
