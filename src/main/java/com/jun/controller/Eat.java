package com.jun.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class Eat {
	
	
	@RequestMapping("/eat")
	public String eat(){
		return "";
	}

}
