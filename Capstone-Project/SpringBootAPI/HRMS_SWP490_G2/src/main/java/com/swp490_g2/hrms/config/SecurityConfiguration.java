package com.swp490_g2.hrms.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf()
                .disable()
                .authorizeHttpRequests()
                .requestMatchers("/user/register",
                        "/user/login",
                        "/user/verify-code",
                        "/v3/api-docs",
                        "/user/get-current-user",
                        "/user/change-password",
                        "/restaurant-category/get-all",
                        "/user/send-verification-code/*",
                        "/socket/**",
                        "/.well-known/pki-validation/*", // For SSL certification
                        "/restaurant/search",
                        "/file/load",
                        "/restaurant/get-by-id/*",
                        "/user/has-controls-of-restaurant/*",
                        "/product-category/**",
                        "/product/get-product-price-ranges-by-restaurant-id/*",
                        "/address/**",
                        "/product/search/*",
                        "/product/get-top-most-ordered/*",
                        "/restaurant/get-reviews-by-restaurant-id/*",
                        "/user/get-admin-contacts",
                        "/order/get-report-income-over-time/*"
                )
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout()
                .logoutUrl("/user/logout")
                .addLogoutHandler(logoutHandler)
                .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
        ;

        return http.build();
    }
}
