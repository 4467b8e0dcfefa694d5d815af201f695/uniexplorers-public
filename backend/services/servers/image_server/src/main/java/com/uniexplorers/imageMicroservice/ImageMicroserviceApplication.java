package com.uniexplorers.imageMicroservice;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class ImageMicroserviceApplication {
	
	@Value("${server_port}")
	private String server_port;
	@Value("${origin}")
	private String origin;
	static String ports;

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(ImageMicroserviceApplication.class);
        app.setDefaultProperties(Collections.singletonMap("server.port", ports));
        app.run(args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		this.ports = server_port;
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins(origin.split(","));
			}
		};
	}

}
