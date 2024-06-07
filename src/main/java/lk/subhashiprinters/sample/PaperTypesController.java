package lk.subhashiprinters.sample;


import java.util.HashMap;
import java.util.List;

import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping (value ="/paperTypes")
public class PaperTypesController {
    @Autowired
    private PaperTypesRepository paperTypeDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private  PrivilageController privilageController;

    // [customerstatus/list]
    @GetMapping(value ="/list", produces = "application/json")
   public List<PaperTypes> PaperTypeList(){
        return paperTypeDao.findAll();
    }


    //[getCategoryby]paperTypes/getbyCategory/
    @GetMapping(value = "/getbyCategory/{ptid}",produces = "application/json")
    public List <PaperTypes>  getByCategoryId( @PathVariable("ptid") Integer ptid){
        return paperTypeDao.getByProductCategory(ptid);
    }

@PostMapping
public String AddPaperType(@RequestBody PaperTypes paperTypes) {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    System.out.print(auth.getName());
    User loggedUser = userDao.findUserByUsername(auth.getName());
    HashMap<String, Boolean> userPrive = privilageController.getPrivilageByUserModule(auth.getName(), "PaperType");
    if (userPrive != null && userPrive.get("ins")) {
        System.out.println(loggedUser);
//why can't we use HashMaps here
        PaperTypes extPapertype = paperTypeDao.getPTybyPCategoryPname(paperTypes.getProduct_category_id().getId(), paperTypes.getName());
        if (extPapertype != null) {
            return ("This paper type is already existing...");
        } else {

            try {
                paperTypeDao.save(paperTypes);
                return "0";
            }
           catch (Exception e){
                return ("Failed to save .. \n" + e.getMessage());
           }
        }

    } else {

        return ("Papertype insert not completed ; You don't have permission!");
    }

    }


}



