package com.ssafy.sosangomin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SosangominApplication {

	public static void main(String[] args) {
		SpringApplication.run(SosangominApplication.class, args);
	}

}
