package lk.subhashiprinters.logincontroller;

import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChangeUserProfileController {


    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private UserRepository userDao;

@GetMapping(value = "/userlogged",produces = "application/json")
public User currentloggedUser(){
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    User currentloggeduser = userDao.findUserByUsername(auth.getName());
    currentloggeduser.setPassword(null);
    return currentloggeduser;
    }






    @PutMapping(value = "/changeuser",produces = "application/json")
    public String userUpdate(@RequestBody User user){

        try{
            //get existing user by id
            User extUser = userDao.getReferenceById(user.getId());
            //check user is having password
            if(user.getPassword() != null){
                //check row password(new) with encoded password of already exisitng user's password
                if( bCryptPasswordEncoder.matches(user.getPassword(),extUser.getPassword())){
                    return "User Profile change is not successful : Password Same as privious password";
                }else {
                    user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
                }
            }else{
                //user doesn't send any password set exsiting password
                user.setPassword(extUser.getPassword());
            }
            userDao.save(user);
            return "0";
        }catch (Exception e){
            return "Update Not Complete : " + e.getMessage();
        }


    }
}
