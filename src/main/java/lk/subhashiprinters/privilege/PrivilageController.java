//privilage- slect,insrt,updt,updt,deltt
package lk.subhashiprinters.privilege;

import ch.qos.logback.core.net.SyslogOutputStream;
import lk.subhashiprinters.privilege.Privilage;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.privilege.PrivilageRepository;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController //create privilege controller class as a route - request handler
@RequestMapping(value = "/privilage")
public class PrivilageController {

    @Autowired
    private PrivilageRepository privilageDao;

    @Autowired
    private UserRepository userDao;

    @GetMapping
    public ModelAndView privilageUI() {
        ModelAndView privilageui = new ModelAndView();
        privilageui.setViewName("privilage.html");
        return privilageui;
    }

//get privilage by logged user given module name
    @GetMapping(value = "/bymodule/{modulename}")
    public HashMap<String,Boolean> getPriviledgeByUserModule(@PathVariable("modulename") String modulename){
        //get logged user authentication obj
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.print(authentication.getDetails());
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        HashMap <String,Boolean> userPriv = new HashMap<>();
        if(loggedUser != null){
            if (loggedUser.getUsername().equals("Admin")) {
                userPriv.put("sel", true);
                userPriv.put("ins", true);
                userPriv.put("upd", true);
                userPriv.put("del", true);
                return userPriv;
            } else {
                String usePrivString = privilageDao.getPrivilageByUserModule(loggedUser.getUsername(), modulename); // 1,1,1,0
                String[] userPriviArray = usePrivString.split(","); //[1,1,1,0]

                userPriv.put("sel", userPriviArray[0].equals("1"));
                userPriv.put("ins", userPriviArray[1].equals("1"));
                userPriv.put("upd", userPriviArray[2].equals("1"));
                userPriv.put("del", userPriviArray[3].equals("1"));

                return userPriv;
            }
        }else{
//            userPriv.put("sel")
        }
        return userPriv;
    }



    @GetMapping(value = "/findall", produces = "application/json")
    public List<Privilage> findAll() {
        return privilageDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }


    @PostMapping
    public  String addPriviledge(@RequestBody Privilage privilage){
        //check privilage for logged user

//check duplicate
Privilage extPrivilage = privilageDao.getByRoleAndModule(privilage.getRole_id().getId(),privilage.getModule_id().getId());

if(extPrivilage != null){
    return "Insert Not Completed : Prvileage Already Inserted";
}

        try{
            //set duplicate values
            privilage.setAdded_user_id(userDao.getReferenceById(1));
            privilage.setAdded_datetime(LocalDateTime.now());
            privilageDao.save(privilage);
            return "0";
        }catch (Exception ex){
            return "Insert Not Completed : " + ex.getMessage();
        }

    }


    //create mapping for uodate priviledge details
    @PutMapping
    public  String updatePrivilag(@RequestBody Privilage privilage){
        //check privilage for logged user

        //check duplicate
        Privilage extPrivilage = privilageDao.getReferenceById(privilage.getId());
        if(extPrivilage == null){
            return "Update is not completed : Privilage is not exsist in database";
        }

        try{
            privilage.setLast_update_time(LocalDateTime.now());
            privilage.setAdded_user_id(userDao.getReferenceById(1));
            privilageDao.save(privilage);
            return "0";

        }catch (Exception ex){
            return "Update is not completed : " + ex.getMessage();
        }

    }

        @DeleteMapping

    public String deletePrivilage(@RequestBody Privilage privilage) {
        //need to check privilage for logged user

        //check exisiting value
        Privilage extPrivilage = privilageDao.getReferenceById(privilage.getId());
        //as a good pactise we user saved data taken from db
        if (extPrivilage != null) {
            try {
                extPrivilage.setDelete_date_time(LocalDateTime.now());
                extPrivilage.setUpdate_user_id(userDao.getReferenceById(2));
                extPrivilage.setSel(false);
                extPrivilage.setUpd(false);
                extPrivilage.setDel(false);
                extPrivilage.setIns(false);
                privilageDao.save(extPrivilage);
                return "0";
            } catch (Exception ex) {
                return "Delete can't be completed" + ex.getMessage();
            }
        } else {
            return "Delete cann't be completed:Privilage not exist";
        }
    }

    public HashMap<String, Boolean> getPrivilageByUserModule(String username, String modulename) {

        HashMap<String, Boolean> userPrivilage = new HashMap<>();// create emplty hashmap object

        User loggedUser = userDao.findUserByUsername(username);
        //privilage- slect,insrt,updt,updt,deltt
        if (loggedUser.getUsername().equals("Admin")) {
            userPrivilage.put("sel", true);
            userPrivilage.put("ins", true);
            userPrivilage.put("upd", true);
            userPrivilage.put("del", true);
            return userPrivilage;
        } else {
            String usePrivString = privilageDao.getPrivilageByUserModule(loggedUser.getUsername(), modulename); // 1,1,1,0
            String[] userPriviArray = usePrivString.split(","); //[1,1,1,0]

            userPrivilage.put("sel", userPriviArray[0].equals("1"));
            userPrivilage.put("ins", userPriviArray[1].equals("1"));
            userPrivilage.put("upd", userPriviArray[2].equals("1"));
            userPrivilage.put("del", userPriviArray[3].equals("1"));

            return userPrivilage;
        }
    }
}
