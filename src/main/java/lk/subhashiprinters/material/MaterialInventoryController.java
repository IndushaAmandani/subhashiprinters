package lk.subhashiprinters.material;

import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

@RestController //make it available the services to front end and back end
@RequestMapping(value = "/inventory") // class level mapping
public class MaterialInventoryController {

    @Autowired //linked required repository
    private MaterialInventoryRepository materialInventoryDao;

    @Autowired
    private InventoryStatusRepository inventoryStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilegeController;

    // create mapping for get UI
    @GetMapping
    public ModelAndView materialUI() {
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Material");
        // create obj called materailUI
        ModelAndView materialUI = new ModelAndView();
        if(loggedUser != null && userPiriv.get("sel")){
            // set material to material html
            materialUI.setViewName("inventory.html");
            // returning ui
            return materialUI;
        }else {
            // set material to material html
            materialUI.setViewName("404.html");
            // returning ui
            return materialUI;
        }



    }



    //Inventory Chart
    @GetMapping(value = "/availbleQtyofMaterials",produces = "application/json")
    public List<MaterialInventory> getAvailableMaterialQty(){
        return materialInventoryDao.getAvailbleMaterialQty();}


    @GetMapping(value ="/bymaterial/{matid}",produces = "application/json")
    public MaterialInventory getMaterialInventoryByMaterial(@PathVariable("matid")Integer matid){
        return materialInventoryDao.getByMaterial(matid);
    };



    // get mapping for get material selected columns details [/material/findall]
    @GetMapping(value = "/list", produces = "application/json")
    public List<MaterialInventory> materialInventoryList(){
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Material");

        if(loggedUser != null && userPiriv.get("sel"))
            //  return materialDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
            return materialInventoryDao.findAll();
        else
            return null;
    }






}
