package lk.subhashiprinters.service;


import lk.subhashiprinters.entity.Role;
import lk.subhashiprinters.entity.User;
import lk.subhashiprinters.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userDao;


    @Override
   @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User logeduser = userDao.findUserByUsername(username);
        System.out.println(username);
        System.out.println(logeduser);
        if( logeduser != null){
            Set<GrantedAuthority> userGranteset = new HashSet<>();
            for (Role role : logeduser.getRoles()){
                userGranteset.add(new SimpleGrantedAuthority(role.getName()));
            }

            List<GrantedAuthority> authorities = new ArrayList<>(userGranteset);

            return new org.springframework.security.core.userdetails.User(logeduser.getUsername(),logeduser.getPassword(),
                            logeduser.getStatus(),true,true,true,authorities);
        }else {
            List<GrantedAuthority> authorities = new ArrayList<>();

            return new org.springframework.security.core.userdetails.User("none", "none",false,
                            true,true,true,authorities);
        }

    }
}
