//privilage- slect,insrt,updt,updt,deltt
package lk.subhashiprinters.controller;

import lk.subhashiprinters.entity.Privilage;
import lk.subhashiprinters.entity.User;
import lk.subhashiprinters.repository.PrivilageRepository;
import lk.subhashiprinters.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Privilage> findAll() {
        return privilageDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
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
                extPrivilage.setSlect(false);
                extPrivilage.setUpdt(false);
                extPrivilage.setDeltt(false);
                extPrivilage.setInsrt(false);
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
