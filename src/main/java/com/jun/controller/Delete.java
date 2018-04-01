package com.jun.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Delete {

	
	@RequestMapping("/del")
	public String delete(){
		return "";
	}
	
}
