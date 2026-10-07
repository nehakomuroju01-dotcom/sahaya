package com.sahaya;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableScheduling
@SpringBootApplication
public class SahayaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SahayaApplication.class, args);
    }

}
