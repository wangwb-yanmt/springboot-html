package com.wangwb.web.controller;



import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.wangwb.web.common.html.StringUtil;

import net.sf.json.JSONObject;


/**
 * 	为什么前台不直接请求服务的登出接口，而是从本前端应用后台绕行登出？
 * 	是为了方便把本应用session中的token清除
 * @author wangwb
 *
 */
@RestController
@RequestMapping("/LogoutController")
public class LogoutController {

	@Autowired
	private RestTemplate restTemplate;
	
	/**
	 * 注销退出
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/logout")
	public Map<String, Object> logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		HttpSession session=request.getSession();
		String token = StringUtil.nullToEmpty(session.getAttribute("token"));
		//调用服务的登出接口
		MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();
		multiValueMap.add("token", token);
		//请求服务端登录接口
		String result = restTemplate.postForObject("http://192.168.120.208:7777//LoginOutController/loginOutByToken", multiValueMap, String.class);
		JSONObject jsonObject = JSONObject.fromObject(result);
		if(!jsonObject.isNullObject()) {
			resultMap.put("success", jsonObject.getBoolean("success"));
			resultMap.put("code", jsonObject.getInt("code"));
			resultMap.put("msg", jsonObject.getString("msg"));
			boolean success =  (boolean) resultMap.get("success");
			if(success){
				session.removeAttribute("token");
				session.invalidate();
				//重定向到登录页
//				response.sendRedirect(request.getContextPath()+"/public/login.html");
			}
		}
		return resultMap;
	}
	
}
