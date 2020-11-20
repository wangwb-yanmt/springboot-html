package com.wangwb.web.common.html;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;


/**
 * login成功时会向本前端应用的session中存储本次登录的token，本filter拦截访问本前端应用的请求，校验session中的token有效时方可访问静态资源
 * @author wangwb
 *
 */
public class SessionFilter implements Filter{
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Resource
	private RedisUtil redisUtil;
	
	public FilterConfig filterConfig;
	
	//不需要过滤的url内容
	private static final String[] unNeedFilterUrlArray = {"/public","/LoginController","/GeetestController"};

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
	}
	
	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
			throws IOException, ServletException {
		HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
		HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
		
		HttpSession session = httpServletRequest.getSession(false);
		
		String requestUrl = httpServletRequest.getRequestURI();
		boolean isNeedFilter = isNeedFilter(requestUrl);
		
		if (!isNeedFilter) {
			//不需要过滤的url
			filterChain.doFilter(servletRequest, servletResponse);
		} else { 
			//需要过滤的url
			// session中包含token
        	if(session!=null&&session.getAttribute("token") != null){
        		String token = (String) session.getAttribute("token");
        		System.out.println("session中存的token是："+token);
        		//判断session中的token是否有效
        		boolean isHasKey = redisUtil.hasKey("token:"+token);
        		if(isHasKey) {
        			//更新token
        			redisUtil.expire("token:"+token, 7200);
        			filterChain.doFilter(servletRequest, servletResponse);
        		} else {
        			httpServletResponse.sendRedirect(httpServletRequest.getContextPath()+"/public/login.html");
        		}
        	}else{
        		httpServletResponse.sendRedirect(httpServletRequest.getContextPath()+"/public/login.html");
            }
        }
	}
	
	@Override
	public void destroy() {
		this.filterConfig = null;
	}
	
	//判断请求的url是否需要过滤
	private boolean isNeedFilter(String requestUrl) {
		for (String unNeedFilterUrl : unNeedFilterUrlArray) {
            if(requestUrl.contains(unNeedFilterUrl)) {
                return false;
            }
        }
        return true;
	}
	
}
