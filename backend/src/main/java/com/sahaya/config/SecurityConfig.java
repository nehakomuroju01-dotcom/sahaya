
package com.sahaya.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origin:http://localhost:5173}")
    private String allowedOrigin;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(
                List.of("http://localhost:*", "http://127.0.0.1:*", "https://*.vercel.app")
        );
        if (allowedOrigin != null && !allowedOrigin.isBlank()) {
            config.addAllowedOriginPattern(allowedOrigin);
        }
        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );
        config.setAllowedHeaders(
                List.of("Authorization", "Content-Type", "Accept")
        );
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public authentication endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Public donation feed & impact metrics
                .requestMatchers(HttpMethod.GET, "/api/donations").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/donations/*").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/impact/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/needs").permitAll()
                .requestMatchers("/api/chat/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/donations/my")
                    .hasRole("DONOR")
                .requestMatchers(HttpMethod.POST, "/api/donations")
                    .hasRole("DONOR")

                // Admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Claims
                .requestMatchers(HttpMethod.POST, "/api/claims/**")
                    .hasRole("RECEIVER_ORG")
                .requestMatchers(HttpMethod.GET, "/api/claims/my")
                    .hasRole("RECEIVER_ORG")

                // Missions
                .requestMatchers(HttpMethod.POST, "/api/missions")
                    .hasRole("RECEIVER_ORG")
                .requestMatchers(HttpMethod.POST, "/api/missions/*/complete")
                    .hasRole("RECEIVER_ORG")
                .requestMatchers(HttpMethod.GET, "/api/missions/available")
                    .hasRole("VOLUNTEER")
                .requestMatchers(HttpMethod.GET, "/api/missions/my")
                    .hasRole("VOLUNTEER")
                .requestMatchers(HttpMethod.GET, "/api/missions/*/handover-code")
                    .hasRole("VOLUNTEER")
                .requestMatchers(HttpMethod.PUT, "/api/missions/*/accept")
                    .hasRole("VOLUNTEER")
                .requestMatchers(HttpMethod.PUT, "/api/missions/*/picked-up")
                    .hasRole("VOLUNTEER")

                // Needs board
                .requestMatchers(HttpMethod.POST, "/api/needs")
                    .hasRole("RECEIVER_ORG")
                .requestMatchers(HttpMethod.GET, "/api/needs/my")
                    .hasRole("RECEIVER_ORG")
                .requestMatchers(HttpMethod.GET, "/api/needs")
                    .authenticated()

                // All other endpoints remain protected
                .anyRequest().authenticated()
            )
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
