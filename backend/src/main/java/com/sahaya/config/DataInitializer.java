package com.sahaya.config;

import com.sahaya.services.DemoDataSeederService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    private final DemoDataSeederService demoDataSeederService;

    public DataInitializer(DemoDataSeederService demoDataSeederService) {
        this.demoDataSeederService = demoDataSeederService;
    }

    @Bean
    CommandLineRunner initializeDemoData() {
        return args -> {
            demoDataSeederService.seedIfEmpty();
        };
    }
}
