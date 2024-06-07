package lk.subhashiprinters.configuration;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
//Enabling web configuration
@EnableWebSecurity
//bean will help to provide configuration accordingly
public class Config {

   // @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
//        http.authorizeHttpRequests(authorizationManagerRequestMatcherRegistry ->
//                authorizationManagerRequestMatcherRegistry
//                .requestMatchers("/login").permitAll()
//                 .requestMatchers("/customer").hasAnyRole("Admin,Manager")
//        );
//




}
