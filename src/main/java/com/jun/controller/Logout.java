package com.jun.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class Logout {

	
	@RequestMapping(value = "/logout")  
    public String logout(HttpServletRequest request,String name){
		
        HttpSession session = request.getSession();
        session.removeAttribute("user");
        
        return "index";
    }  
}
