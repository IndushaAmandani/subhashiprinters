package lk.subhashiprinters.configuration;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebConfiguration {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.authorizeRequests().
                antMatchers("/resources/**").permitAll().
                antMatchers("/app-assets/**").permitAll().
                antMatchers("/login").permitAll().
                antMatchers("/createadmin").permitAll().
                antMatchers("/errorpagge").permitAll().
                antMatchers("/dashboard","/userprivilage/bymodule").hasAnyAuthority("ADMIN","MANAGER","PRODUCT-MANAGER","PRINTING-OFFICER","CASHIER").
                antMatchers("/employee/**").hasAnyAuthority("ADMIN","MANAGER").
                antMatchers("/user/**").hasAnyAuthority("ADMIN","MANAGER").
                antMatchers("/privilage/**").hasAnyAuthority("ADMIN","MANAGER").
                antMatchers("/product/**","/productCategory").hasAnyAuthority("ADMIN","MANAGER","PRODUCT-MANAGER","PRINTING-OFFICER","CASHIER").
                antMatchers("/paperInkTypes/**").hasAnyAuthority("ADMIN","MANAGER","PRODUCT-MANAGER","PRINTING-OFFICER").
                antMatchers("/material/**").hasAnyAuthority("ADMIN","MANAGER","PRODUCT-MANAGER","PRINTING-OFFICER","CASHIER").
                antMatchers("/dailyProduct/**","/CustomerOrder/**").hasAnyAuthority("ADMIN","MANAGER","PRODUCT-MANAGER","PRINTING-OFFICER","CASHIER").
                antMatchers("/customer/**","/CustomerOrder/**","/cpayment/**").hasAnyAuthority("ADMIN","MANAGER","CASHIER").
                anyRequest().authenticated().and()
                .csrf().disable(). //prevent cross-reference access
                formLogin().
                    loginPage("/login"). // login page URL
                    failureUrl("/login?error=usernamepassorderror").
                    defaultSuccessUrl("/dashboard",true). // login success URL//alwasys to redirecting to login page
                    usernameParameter("username"). // username paarameter name
                    passwordParameter("password").// password [arameter name
                and().

                logout().
                    logoutRequestMatcher(new AntPathRequestMatcher("/logout")).
                    logoutSuccessUrl("/login").and().

                exceptionHandling().accessDeniedPage("/errorpagge");

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return  new BCryptPasswordEncoder();
    }

}
