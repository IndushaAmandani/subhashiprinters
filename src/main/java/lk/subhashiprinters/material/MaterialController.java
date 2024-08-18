package lk.subhashiprinters.material;

import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;


import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController //make it available the services to front end and back end
@RequestMapping(value = "/material") // class level mapping 
public class MaterialController {

    @Autowired //linked required repository
    private MaterialRepository materialDao;

    @Autowired
    private MaterialStatusRepository materialStatusDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilegeController;
    @Autowired
    private MaterialInventoryRepository inventoryDao;

    @Autowired
    private InventoryStatusRepository inventoryStatusDao;

    // create mapping for get UI
    @GetMapping
    public ModelAndView materialUI() {
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "Material");
        // create obj called materailUI
        ModelAndView materialUI = new ModelAndView();
        if (loggedUser != null && userPiriv.get("sel")) {
            // set material to material html
            materialUI.setViewName("material.html");
            // returning ui
            return materialUI;
        } else {
            // set material to material html
            materialUI.setViewName("404.html");
            // returning ui
            return materialUI;
        }


    }

    // get mapping for get material selected columns details [/material/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<Material> materialFindAll() {
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "Material");

        if (loggedUser != null && userPiriv.get("sel"))
            //  return materialDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
            return materialDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
        else
            return null;
    }


    //List returning list of status from repo
    @GetMapping(value = "/list", produces = "application/json")
    public List<Material> materialList() {
        return materialDao.materialPricelist();
    }

    //get object by given id using path variable [ /material/getbyid/{id}]
    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public Material getByPathId(@PathVariable("id") Integer id) {
        return materialDao.getReferenceById(id);
    }


    //get object list by given supplier using path variable [ /material/listbysupplier/{sid}]
    @GetMapping(value = "/listbysupplier/{sid}", produces = "application/json")
    public List<Material> getLisyBySId(@PathVariable("sid") Integer sid) {
        return materialDao.getListBySupplier(sid);
    }

    @GetMapping(value = "/notlistbysupplier/{sid}", produces = "application/json")
    public List<Material> getNotLisyBySId(@PathVariable("sid") Integer sid) {
        return materialDao.getNotListBySupplier(sid);
    }

    //get object list by given supplier using path variable [ /material/listbyquotation/{sid}]
    @GetMapping(value = "/listbyquotation/{qid}", produces = "application/json")
    public List<Material> getLisyByQId(@PathVariable("qid") Integer qid) {
        return materialDao.getListByQuotation(qid);
    }

    //get object list by given supplier using path variable [ /material/listbyporder/{poid}]
    @GetMapping(value = "/listbyporder/{poid}", produces = "application/json")
    public List<Material> getLisyByPOId(@PathVariable("poid") Integer poid) {
        return materialDao.getListByPOrder(poid);
    }


    @GetMapping(value = "/getMaterialListbycategory", produces = "application/json")
    public List<Material> getMaterialListbyCategory() {
        return materialDao.getMaterialListbyCategory();
    }

    ;

    @GetMapping(value = "/listbySubCAtegory/{subid}", produces = "application/json")
    public List<Material> getMaterialListbySubCategory(@PathVariable("subid") Integer subid) {
        return materialDao.getMaterialListbySubCategory(subid);
    }

    ;


    @GetMapping(value = "/listbyProductCategory/{pcid}", produces = "application/json")
    public List<Material> getMaterialListbyProductCategory(@PathVariable("pcid") Integer pcid) {
        return materialDao.getMaterialListbyProductCategory(pcid);
    }

    //post mapping for insert material [/material - post]
    @Transactional
    @PostMapping
    public String insertMaterial(@RequestBody Material material) {
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return "Material Insert Not completed : You don't have permission";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "Material");

        if (loggedUser != null && userPiriv.get("ins")) {
            // user has privilage for insert material

            // need to check duplicate
            Material extMaterial = materialDao.getMaterialByName(material.getName());
            if (extMaterial != null) {
                return "Material Insert Not completed : Material name already ext";
            }


            try {
                // set auto set value
                material.setAdded_date(LocalDateTime.now());
                // material.setMaterialcode("00003");
                material.setCode(materialDao.nextMaterialNumber());
                material.setAdded_user_id(loggedUser);
                //do the requeired operation
                materialDao.save(material);
                //Initailize Inventory
                MaterialInventory newInventoryforMaterial = new MaterialInventory();
                newInventoryforMaterial.setMaterial_id(material);
                newInventoryforMaterial.setTotalqty(BigDecimal.ZERO);
                newInventoryforMaterial.setInventorystatus_id(inventoryStatusDao.getReferenceById(2));
                newInventoryforMaterial.setRemoveqty(BigDecimal.ZERO);
                newInventoryforMaterial.setAvaqty(BigDecimal.ZERO);
                inventoryDao.save(newInventoryforMaterial);
                return "0";
            } catch (Exception ex) {
                return "Material Insert Not completed : " + ex.getMessage();
            }


        } else {
            return "Material Insert Not completed : You don't have permissing";
        }


    }


    //delete mapping for delete material [/material - update]

    @PutMapping
    public String updateMaterial(@RequestBody Material material) {
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return "Material Update Not completed : You don't have permission";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "Material");

        if (loggedUser != null && userPiriv.get("upd")) {

            Material extMaterial = materialDao.getReferenceById(material.getId());
            if (extMaterial == null && !extMaterial.getCode().equals(material.getCode())) {
                return "Material Update Not completed : Material not available";
            }

            try {
                material.setUpdate_date(LocalDateTime.now());
                material.setUpdate_user_id(loggedUser);
                try {
                    //Inventory Update
                    MaterialInventory existingMaterial = inventoryDao.getByMaterial(material.getId());
                    if (existingMaterial == null) {
                        System.out.println("hi");
                        //Initailize Inventory

                        MaterialInventory newInventoryforMaterial = new MaterialInventory();
                        newInventoryforMaterial.setMaterial_id(material);
                        newInventoryforMaterial.setTotalqty(BigDecimal.ZERO);
                        newInventoryforMaterial.setInventorystatus_id(inventoryStatusDao.getReferenceById(2));
                        newInventoryforMaterial.setRemoveqty(BigDecimal.ZERO);
                        newInventoryforMaterial.setAvaqty(BigDecimal.ZERO);
                        inventoryDao.save(newInventoryforMaterial);
                    }
                } catch (Exception e) {
                    return "Material Inventory Update Not completed : " + e.getMessage();
                }


            materialDao.save(material);
            return "0";

        } catch(Exception exception){

            return "Material Update Not completed : " + exception.getMessage();

        }
    } else {
        return "Material Update Not completed : You don't have permission";
    }

}


    //delete mapping for delete material [/material - delete]
    @DeleteMapping
    public String deleteMaterial(@RequestBody Material material) {
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return "Material Delete Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "Material");

        if (loggedUser != null && userPiriv.get("del")) {

            Material extMaterial = materialDao.getReferenceById(material.getId());
            if (extMaterial == null) {
                return "Material Delete Not completed : Material not available";
            }


              MaterialInventory exisitingInventoryForMaterial =  inventoryDao.getByMaterial(extMaterial.getId());
            if(exisitingInventoryForMaterial != null){
                BigDecimal avayqty = exisitingInventoryForMaterial.getAvaqty() != null ? exisitingInventoryForMaterial.getAvaqty() : BigDecimal.ZERO;
                if(avayqty.compareTo(BigDecimal.ZERO)> 0){
                    return "Material Delete Not completed : Material has Inventory";
                }

            }

            try {
                extMaterial.setMaterial_status_id(materialStatusDao.getReferenceById(2));
                extMaterial.setDeleted_date(LocalDateTime.now());
                extMaterial.setDelete_user_id(loggedUser);

                materialDao.save(extMaterial);
                return "0";
            } catch (Exception exception) {
                return "Material Delete Not completed : " + exception.getMessage();
            }
        } else {
            return "Material Delete Not completed : You don't have permissing";
        }
    }


}
