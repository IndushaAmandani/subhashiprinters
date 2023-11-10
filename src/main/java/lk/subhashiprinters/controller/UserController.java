//privilage- slect,insrt,updt,updt,deltt
package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.User;
import lk.subhashiprinters.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController //
@RequestMapping(value = "/user") //class level mapping
public class UserController {

    @Autowired
    private UserRepository userDao; //

    @Autowired
    private PrivilageController privilageController; //

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder; //

    @GetMapping
    public ModelAndView userUI(){
        ModelAndView userui = new ModelAndView();
        userui.setViewName("user.html");
        return userui;
    }

    //create get mapping for get user all data [/user/findAll ]
    @GetMapping(value = "/findall" , produces = "application/json")
    public List<User> findAll(){
        // need to check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrvi = privilageController.getPrivilageByUserModule(auth.getName(), "User");

        if(loggedUser != null && userPrvi.get("sel")){
            //return userDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
            return userDao.findAll();
        }else {
            return null;
        }
    }

    //get mapping service for get employee by given path variable id [ /employee/getbyid/1]
    @GetMapping(value ="/getbyid/{id}" ,produces = "application/json")
    public User getUserbyid(@PathVariable("id") Integer id){
        return userDao.getReferenceById(id);
    }


    //user past mapping [/user - POST] user add
    @PostMapping
    public String inserUser(@RequestBody User user){
       //need check logged user privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof AnonymousAuthenticationToken) {
            return "User Insert Not completed : You don't have permissing";
        }
        // get logged user authentication object
        User loggrgUser = userDao.findUserByUsername(auth.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPriv = privilageController.getPrivilageByUserModule(loggrgUser.getUsername(),"User");

        if(loggrgUser !=null && userPriv.get("ins")){
            //need to check duplicate
            User extUser = userDao.findUserByUsername(user.getUsername());
            if(extUser != null){
                return "User Insert Not Successfully : User name allready ext";
            }


            //try to save with set auto set value
            try {

                user.setAddeddatetime(LocalDateTime.now());
                user.setPhotoname("user3.png");
                user.setPhotopath("resources/images/user_photo/");
                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));


                userDao.save(user);
                return "0";
            }catch (Exception exception){
                return "User Insert Not Successfully : " + exception.getMessage();
            }
        }else {
            return "User Insert Not Successfully : You don't have privilage";
        }

    }

    //user past mapping [/user - PUT] user update
    @PutMapping
    public String updateUser(@RequestBody User user){
        //need check logged user privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggrgUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> userPriv = privilageController.getPrivilageByUserModule(auth.getName(),"User");
        //privilage- slect,insrt,updt,updt,deltt
        if(loggrgUser !=null && userPriv.get("upd")){

            //need to check duplicate
            User extUser = userDao.getReferenceById(user.getId());
            if(extUser == null){
                return "User Deleted Not Successfully : User Not available";
            }



            //try to save with set auto set value
            try {

                user.setUpdatedatetime(LocalDateTime.now());
               // user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
                user.setPassword(extUser.getPassword());
                userDao.save(user);
                return "0";
            }catch (Exception exception){
                return "User Update Not Successfully : " + exception.getMessage();
            }
        }else {
            return "User Update Not Successfully : You don't have privilage";
        }

    }


    //user past mapping [/user - Delete] user update
    @DeleteMapping
    public String DeleteUser(@RequestBody User user){
        //need check logged user privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggrgUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> userPriv = privilageController.getPrivilageByUserModule(auth.getName(),"User");

        if(loggrgUser !=null && userPriv.get("del")){

            //need to check duplicate
            User extUser = userDao.getReferenceById(user.getId());
            if(extUser == null){
                return "User Deleted Not Successfully : User Not available";
            }

            //try to save with set auto set value
            try {

                extUser.setUpdatedatetime(LocalDateTime.now());

                extUser.setStatus(false);
                userDao.save(extUser);
                return "0";
            }catch (Exception exception){
                return "User Deleted Not Successfully : " + exception.getMessage();
            }
        }else {
            return "User Deleted Not Successfully : You don't have privilage";
        }

    }
}

//    @DeleteMapping
//    public String deleteEmployee(@RequestBody Employee employee){
//        //need to check privilage
//
//        //check employee exsit
//        Employee extEmp = employeeDao.getReferenceById(employee.getId());
//
//        if(extEmp != null){
//            try {
//
//                //set auto insert values
//                extEmp.setDelete_date_time(LocalDateTime.now());
//                extEmp.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));
//
//                employeeDao.save(extEmp);
//
//                //need to update avaible depenence
//
//                return "0";
//
//            }catch (Exception ex){
//                return "Delete Not Completd : " + ex.getMessage();
//            }
//        }else {
//            return "Delete Not Completed : Emplyoyee Not Avalable";
//        }
//
//    }