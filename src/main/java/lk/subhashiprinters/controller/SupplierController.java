package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.Supplier;
import lk.subhashiprinters.entity.User;
import lk.subhashiprinters.repository.SupplierRepository;
import lk.subhashiprinters.repository.SupplierStatusRepository;
import lk.subhashiprinters.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController //
@RequestMapping(value = "/supplier") //Class level mapping
public class  SupplierController {

    @Autowired // for create instance
    private SupplierRepository supplierDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilegeController;

       @Autowired
    private SupplierStatusRepository supplierStatusDao;

    //get supplier UI [/supplier]
    @GetMapping
    public ModelAndView supplierUI(){
        ModelAndView supplierView = new ModelAndView();
        supplierView.setViewName("supplier.html");

        return supplierView;
    }

    @GetMapping(value = "/list" , produces = "application/json")
    public List<Supplier> supplierList(){
        return supplierDao.list();
    }


    //get object by given id using path variable [ /supplier/getbyid/{id}]
    @GetMapping(value = "/getbyid/{id}" , produces = "application/json")
    public Supplier getByPathId(@PathVariable("id")Integer id){
         return supplierDao.getReferenceById(id);
    }

   /*
    //get object by given id using query variable [ /item/getbyid?id=1]
    @GetMapping(value = "/getbyid" , params = {"id"},produces = "application/json")
    public Item getByQueryId(@RequestParam("id")Integer id){
        return itemDao.getReferenceById(id);
    }
*/


    // get mapping for get supplier selected columns details [/supplier/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Supplier> supplierFindAll(){
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Supplier");

        if(loggedUser != null && userPiriv.get("sel"))
              //  return itemDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
            return supplierDao.findAll();
        else
            return null;
    }


    //post mapping for insert item [/item - post]
    @PostMapping
    public String insertSuppler(@RequestBody Supplier supplier){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Supplier Insert Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Supplier");

        if(loggedUser != null && userPiriv.get("ins")){
            // user has privilage for insert item

            // need to check duplicate
            Supplier extSupplier = supplierDao.findSupplierByEmail(supplier.getCompany_email());
            if(extSupplier != null){
                return "Supplier Insert Not completed : supplier email allready ext";
            }



            try {
                // set auto set value
               supplier.setAdded_datetime(LocalDateTime.now());
                supplier.setReg_no(supplierDao.getNextSupplierRegNo());
                supplier.setAdded_user_id(loggedUser);
                //do the requeired operation
                supplierDao.save(supplier);

                return "0";
            }catch (Exception ex){
                return "Supplier Insert Not completed : " + ex.getMessage();
            }


        }
        else {
            return "Supplier Insert Not completed : You don't have permissing";
        }


    }

    //update mapping for update supplier [/supplier - update]
    @PutMapping
    @Transactional
    public String updateSupplier(@RequestBody Supplier supplier){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Supplier Update Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Supplier");

        if(loggedUser != null && userPiriv.get("upd")){

            Supplier extSupp = supplierDao.getReferenceById(supplier.getId());
            if(extSupp == null && !extSupp.getReg_no().equals(supplier.getReg_no())){
                return "Supplier Update Not completed : Supplier not available";
            }

            try {

                // set auto set value
                supplier.setUpdate_datetime(LocalDateTime.now());
                supplier.setUpdate_user_id(loggedUser);
                //do the requeired operation
                supplierDao.save(supplier);
                return "0";
            }catch (Exception exception){
                return "Supplier Update Not completed : " + exception.getMessage();
            }
        }else {
            return "Supplier Update Not completed : You don't have permissing";
        }
    }



    //delete mapping for delete supplier [/supplier - delete]
    @DeleteMapping
    public String deleteSupplier(@RequestBody Supplier supplier){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Supplier Delete Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Supplier");

        if(loggedUser != null && userPiriv.get("del")){

            Supplier extSup = supplierDao.getReferenceById(supplier.getId());
            if(extSup == null ){
                return "Supplier Delete Not completed : Supplier not available";
            }

            try {
                extSup.setSupplier_status_id(supplierStatusDao.getReferenceById(3));
                extSup.setDelete_datetime(LocalDateTime.now());
                extSup.setDelete_user_id(loggedUser);

                supplierDao.save(extSup);
                return "0";
            }catch (Exception exception){
                return "Supplier Delete Not completed : " + exception.getMessage();
            }
        }else {
            return "Supplier Delete Not completed : You don't have permissing";
        }
    }



}
