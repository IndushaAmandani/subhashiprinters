package lk.subhashiprinters;

import lk.subhashiprinters.entity.Role;
import lk.subhashiprinters.entity.User;
import lk.subhashiprinters.repository.RoleRepository;
import lk.subhashiprinters.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;



@SpringBootApplication
@RestController
public class SubhashiPrintersApplication {

	@Autowired
	private UserRepository userDao;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	private RoleRepository roleDao;

	public static void main(String[] args) {
		SpringApplication.run(SubhashiPrintersApplication.class, args);
	}

	@GetMapping(value = "/createadmin")
	public String createAdmin(){

		User extadminuser = userDao.findUserByUsername("Admin");

		if(extadminuser == null ){
			User newAdminuser = new User();
			newAdminuser.setUsername("Admin");
			newAdminuser.setPassword(bCryptPasswordEncoder.encode("12345"));
			newAdminuser.setEmail("Admin@gmail.com");
			newAdminuser.setStatus(true);
			newAdminuser.setAddeddatetime(LocalDateTime.now());
			Set<Role> userRole = new HashSet<>();
			userRole.add(roleDao.getReferenceById(1));

			newAdminuser.setRoles(userRole);

			userDao.save(newAdminuser);
		}


		return "<script> window.location.replace('/login');</script>";
	}



}
