
package com.sahaya.config;

import com.sahaya.models.Role;
import com.sahaya.models.User;
import com.sahaya.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner initializeAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${sahaya.admin.email:}") String adminEmail,
            @Value("${sahaya.admin.password:}") String adminPassword
    ) {
        return args -> {
            if (!StringUtils.hasText(adminEmail)
                    || !StringUtils.hasText(adminPassword)) {
                System.out.println(
                        "Admin initialization skipped: admin credentials not configured."
                );
                return;
            }

            if (adminPassword.length() < 12) {
                throw new IllegalStateException(
                        "Admin password must be at least 12 characters."
                );
            }

            var existing = userRepository.findByEmail(adminEmail);

            if (existing.isPresent()) {
                if (existing.get().getRole() != Role.ADMIN) {
                    throw new IllegalStateException(
                            "Configured admin email already belongs to a non-admin account."
                    );
                }
                return;
            }

            User admin = new User();
            admin.setName("Sahaya Administrator");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setVerified(true);

            userRepository.save(admin);
            System.out.println("Sahaya admin account initialized.");
        };
    }
}
