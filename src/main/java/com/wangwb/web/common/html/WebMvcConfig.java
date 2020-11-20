package com.wangwb.web.common.html;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 	WebMvc配置
 * @author wangwb
 *
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer{

	/**
	 * 设置系统默认访问页面
	 */
	@Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/public/login.html");
//        最高优先级
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }
}
