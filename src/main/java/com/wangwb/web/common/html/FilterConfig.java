//package com.wangwb.web.common.html;
//
//
//import javax.servlet.Filter;
//
//import org.springframework.boot.web.servlet.FilterRegistrationBean;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.filter.DelegatingFilterProxy;
//
//
//
//
///**
// * filter配置类
// * @author wangwb
// *
// */
//@Configuration
//public class FilterConfig {
//
//	@Bean
//	public Filter sessionFilter() {
//      return new SessionFilter();
//	}
//	/**
//	 * filter注册,可在filter获取应用上下文
//	 */
//	@Bean
//	public FilterRegistrationBean myFilterRegist() {
//      FilterRegistrationBean registration = new FilterRegistrationBean();
//      registration.setFilter(new DelegatingFilterProxy("sessionFilter"));
//      registration.addUrlPatterns("/*");
//      registration.setOrder(0);
//      registration.setName("sessionFilter");
//      return registration;
//	}
//	
//	
//}
//
