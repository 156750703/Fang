package com.jun.controller;

import java.util.concurrent.atomic.AtomicLong;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.jun.fang.core.model.Player;
import com.jun.model.User;

@Controller
public class Login {

	//临时用一个自增的来代替userid
	private static AtomicLong userid = new AtomicLong(0);
	
	
	private static final String AFTER_LOGIN = "enterHall";
	@RequestMapping(value = "/login")  
    public String login(HttpServletRequest request,String name){
		
        HttpSession session = request.getSession();
        User user = new User();
        user.setId(userid.addAndGet(1));
        user.setName(name);
        session.setAttribute("user", user);
        
        return "redirect:/"+AFTER_LOGIN;
    }  
}
