package lk.subhashiprinters.logincontroller;


import lk.subhashiprinters.loggeduser.LoggedUser;
import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.userm.Role;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserHasRole;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Base64;
import java.util.HashMap;

@RestController
public class LoginController {

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilageController;




    @GetMapping(value = "/login")
    public ModelAndView loginUI(){

        ModelAndView loginui = new ModelAndView();
        loginui.setViewName("login.html");

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth != null || auth instanceof AnonymousAuthenticationToken){
            SecurityContextHolder.clearContext();
        }

        return loginui;
    }




    @GetMapping(value = "/login" , params = "error")
    public ModelAndView loginErrorUI(@RequestParam("error") String error){
        ModelAndView loginui = new ModelAndView();
        loginui.setViewName("login.html");
        return loginui;
    }

    @GetMapping(value = {"/dashboard", "/"})
    public ModelAndView dashboardUI(){

        //Get logged user authountication obj
        Authentication auth =  SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        ModelAndView dashboardui = new ModelAndView();
        dashboardui.addObject("loggedusername",auth.getName());
//       for(Role role : loggedUser.getRoles()) {
//           System.out.println(role.getName());
//           if(role.getName() == "CASHIER"){
//               dashboardui.setViewName("dashboard2.html");
//           }else{
//               dashboardui.setViewName("dashboard.html");
//           }
//       }

        //ModelAndView dashboardui = new ModelAndView(redirect:/dashboard);
        //add obj

//        dashboardui.addObject("loguserrole",logedUser.ge);
//        dashboardui.addObject("loguserrole",loggedUser.getUpdatedatetime());
//
  //     dashboardui.addObject("loggeduserphoto",loggedUser.getUserphoto());


        dashboardui.setViewName("dashboard.html");
        return dashboardui;
    }

    @GetMapping(value = "/errorpagge")
    public ModelAndView accessdDenidUI(){
        ModelAndView accessdenidui = new ModelAndView();
        accessdenidui.setViewName("404.html");
        return accessdenidui;
    }

    // get privilage object by module name [/userprivilage/bymodule?modulename=Item]
    @GetMapping(value = "/userprivilage/bymodule" , params = {"modulename"} , produces = "application/json")
    public  HashMap<String,Boolean> getPrivilageBYModule(@RequestParam("modulename") String modulename){
        // get authentication object by security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String,Boolean> userPrivilage = new HashMap<>();// create emplty hashmap object

        if(auth == null || auth instanceof AnonymousAuthenticationToken){
            userPrivilage.put("sel",false);
            userPrivilage.put("ins",false);
            userPrivilage.put("upd",false);
            userPrivilage.put("del",false);
            return userPrivilage;
        }else {
           return  privilageController.getPrivilageByUserModule(auth.getName(),modulename);
        }

    }



    // get logged user details
    @GetMapping(value = "/loggeduser",produces = "application/json")
    public LoggedUser getLoggedUserDetails(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedExtUser = userDao.findUserByUsername(auth.getName());

        if(loggedExtUser != null && !(auth instanceof AnonymousAuthenticationToken)){
            LoggedUser loggedUser = new LoggedUser();

            String username = loggedExtUser.getUsername();
            loggedUser.setUsername(username);

            String role = loggedExtUser.getRoles().iterator().next().getName();
            loggedUser.setRole(role);

            loggedUser.setPhotoname(loggedExtUser.getPhotoname());
            loggedUser.setPhotopath(loggedExtUser.getPhotopath());

            loggedUser.setUserphoto(loggedExtUser.getUserphoto());

            return loggedUser;

        }else {
            return null;
        }


    }


}

/*import java.util.Base64;

public class UserPhotoHandler {
    public static void main(String[] args) {
        // Example of loggedExtUser with photo as byte array
        byte[] userPhotoBytes = loggedExtUser.getUserphoto();

        // Encode byte array to Base64 string
        String userPhotoBase64 = Base64.getEncoder().encodeToString(userPhotoBytes);

        // Set the Base64 string as the user photo
        loggedUser.setUserphoto(userPhotoBase64);
    }
}
*/