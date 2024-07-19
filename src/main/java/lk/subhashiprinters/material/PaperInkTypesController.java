package lk.subhashiprinters.material;


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
@RequestMapping(value = "/paperInkTypes")
public class PaperInkTypesController {
    @Autowired
    private PaperInkTypesRepository paperinkTypesDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilageController;

    // [customerstatus/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<PaperInkTypes> PaperInkTypeList() {
        return paperinkTypesDao.findAll();
    }


    //[getCategoryby]paperTypes/getbyCategory/
//    @GetMapping(value = "/getbyCategory/{ptid}", produces = "application/json")
//    public List<PaperInkTypes> getByCategoryId(@PathVariable("ptid") Integer ptid) {
//        return paperinkTypesDao.getByProductCategory(ptid);
//    }
// [getCategoryby]paperTypes/getbyCategory/
    @GetMapping(value = "/getbyMCategory/{mcid}", produces = "application/json")
    public List<PaperInkTypes> getbyMCategory(@PathVariable("mcid") Integer mcid) {
        return paperinkTypesDao.getByMCategory(mcid);
    }
    @GetMapping(value = "/paper", produces = "application/json")
    public List<PaperInkTypes> getPITByPaperCategory() {
        return paperinkTypesDao.getPITByPaperCategory();
    }
    @GetMapping(value = "/ink", produces = "application/json")
    public List<PaperInkTypes> getPITByInkCategory() {
        return paperinkTypesDao.getPITByInkCategory();
    }

   @PostMapping
  public String AddPaperInkType(@RequestBody PaperInkTypes paperinkTypes) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.print(auth.getName());
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> userPrive = privilageController.getPrivilageByUserModule(auth.getName(), "Product");


        if (!userPrive.get("ins")) {
            return ("Sub Category insert not completed ; You don't have permission!");
        }
        //why can't we use HashMaps here

        PaperInkTypes extPapertype = paperinkTypesDao.getPITbyMaterialCategoryandName(paperinkTypes.getMaterial_category_id().getId(), paperinkTypes.getName());
        if (extPapertype != null) {
            return ("This Sub Category is already existing...");
        }
        try {
            paperinkTypesDao.save(paperinkTypes);
            return "0";
        } catch (Exception e) {
            return ("Failed to save .. \n" + e.getMessage());
        }

    }



}



