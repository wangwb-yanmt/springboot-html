package com.wangwb.web.controller;


import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.wangwb.web.common.html.StringUtil;

import net.sf.json.JSONObject;


/**
 * 	为什么不直接请求服务的登录接口，而是从本前端应用后台绕行登陆？
 * 	是为了方便把token存到本应用的session中以便SessionFilter校验，控制静态资源的访问
 * @author wangwb
 *
 */
@RestController
@RequestMapping("/LoginController")
public class LoginController {

	@Autowired
	private RestTemplate restTemplate;
	
	@PostMapping("/login")
	public Map<String, Object> login(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session=request.getSession();
		if(null!=session){
			session.invalidate();
		}
		Cookie[] cookies=request.getCookies();
		if(null!=cookies){
			cookies[0].setMaxAge(0);
		}
		
		Map<String,Object> resultMap = new HashMap<String, Object>();
		String userName = StringUtil.nullToEmpty(request.getParameter("userName"));//用户名
    	String password = StringUtil.nullToEmpty(request.getParameter("password"));//密码
		MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();
		multiValueMap.add("userName", userName);
		multiValueMap.add("password", password);
		//请求服务端登录接口
		String result = restTemplate.postForObject("http://192.168.120.208:7777/LoginController/loginForToken", multiValueMap, String.class);
		JSONObject jsonObject = JSONObject.fromObject(result);
		if(!jsonObject.isNullObject()) {
			resultMap = (Map<String, Object>) jsonObject;
			boolean success =  (boolean) resultMap.get("success");
			//登录成功则把token保存到前端服务session中
			if(success) {
				session=request.getSession(true);
				String token = jsonObject.getString("token");
				session.setAttribute("token", token);
			}
		}
		return resultMap;
	}
	
}
