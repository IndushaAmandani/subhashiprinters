package lk.subhashiprinters.controller;

import lk.subhashiprinters.entity.Privilage;
import lk.subhashiprinters.entity.User;
import lk.subhashiprinters.repository.PrivilageRepository;
import lk.subhashiprinters.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/privilage")
public class PrivilageController {

    @Autowired
    private PrivilageRepository privilageDao;

    @Autowired
    private UserRepository userDao;

    @GetMapping
    public ModelAndView privilageUI(){
        ModelAndView privilageui = new ModelAndView();
        privilageui.setViewName("privilage.html");
        return privilageui;
    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<Privilage> findAll(){
        return privilageDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }



    public HashMap<String,Boolean> getPrivilageByUserModule(String username, String modulename){

        HashMap<String,Boolean> userPrivilage = new HashMap<>();// create emplty hashmap object

            User loggedUser = userDao.findUserByUsername(username);

            if(loggedUser.getUsername().equals("Admin")){
                userPrivilage.put("sel",true);
                userPrivilage.put("ins",true);
                userPrivilage.put("upd",true);
                userPrivilage.put("del",true);
                return userPrivilage;
            }else {
                String usePrivString = privilageDao.getPrivilageByUserModule(loggedUser.getUsername() , modulename); // 1,1,1,0
                String[] userPriviArray = usePrivString.split(","); //[1,1,1,0]

                userPrivilage.put("sel",userPriviArray[0].equals("1"));
                userPrivilage.put("ins",userPriviArray[1].equals("1"));
                userPrivilage.put("upd",userPriviArray[2].equals("1"));
                userPrivilage.put("del",userPriviArray[3].equals("1"));

                return userPrivilage;
            }
    }
}
