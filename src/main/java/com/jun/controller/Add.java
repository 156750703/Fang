package com.jun.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jun.fang.core.model.Point;

@RestController
public class Add {

	
	@RequestMapping("/add")
	public String add(Point point){
		return "";
	}
	
}
