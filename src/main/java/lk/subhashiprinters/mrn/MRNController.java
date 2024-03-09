package lk.subhashiprinters.mrn;


import lk.subhashiprinters.mrn.MRN;
import lk.subhashiprinters.mrn.MRNRepository;
import lk.subhashiprinters.mrn.MRNStatusRepository;
import lk.subhashiprinters.purchaseorder.PurchaseOrder;
import lk.subhashiprinters.purchaseorder.PurchaseOrderHasMaterial;
import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/mrn")
public class MRNController {

    @Autowired
    private MRNRepository mrnDao;

    @Autowired
    private MRNStatusRepository mrnStatusDao;

//    @Autowired
//    private MRNRepository purchaseOrderHasMaterialDao;

    @Autowired
    private PrivilageController privilegeController;

    @Autowired
    private UserRepository userDao;

    //
    @GetMapping
    public ModelAndView mrnUI() {
        ModelAndView mrnui = new ModelAndView();
        mrnui.setViewName("mrn.html");
        return mrnui;
    }

    //get object by given id using path variable [ /purchaseorder/getbyid/{id}]
    @GetMapping(value = "/getbyid/{id}" , produces = "application/json")
    public MRN getByPathId(@PathVariable("id")Integer id){
        return mrnDao.getReferenceById(id);
    }

    @GetMapping(value = "/findall", produces = "application/json")
    public List<MRN> findAll() {
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "Mrn");

        if (loggedUser != null && userPiriv.get("sel"))
            return mrnDao.findAll();
        else {
            List<MRN> mrnArrayList = new ArrayList<>();
            return mrnArrayList;
        }
    }

    @PostMapping
    @Transactional
    public String inserPorder(@RequestBody PurchaseOrder porder) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "PurchaseOrder");
        if (userPrive != null && userPrive.get("ins")) {

            try {

                porder.setAddeddatetime(LocalDateTime.now());
                porder.setAdded_user_id(logeduser);
           //     porder.setOrder_no(purchaseOrderDao.getNextPorderNo());


                for (PurchaseOrderHasMaterial pohi : porder.getPurchaseOrderHasMaterialList()) {
                    pohi.setPurchase_order_id(porder);
                }
           //     purchaseOrderDao.save(porder);

                return "0";
            } catch (Exception ex) {
                return "Insert Not Complete : " + ex.getMessage();
            }

        } else {
            return "Purchase order insert Not completed : You don't have permissing";
        }

    }

    @PutMapping
    @Transactional
    public String updatePorder(@RequestBody PurchaseOrder porder) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "PurchaseOrder");
        if (userPrive != null && userPrive.get("upd")) {

          //  PurchaseOrder extPurchaseOrder = purchaseOrderDao.getReferenceById(porder.getId());

//            if(extPurchaseOrder == null){
//                return "Purchase order Update Not completed : Purchase order doesn't exsites..!";
//            }
            try {

                porder.setUpdatedateitme(LocalDateTime.now());
                porder.setUpdate_user_id(logeduser);


                for (PurchaseOrderHasMaterial pohi : porder.getPurchaseOrderHasMaterialList()) {
                    pohi.setPurchase_order_id(porder);
                }
            //    purchaseOrderDao.save(porder);

                return "0";
            } catch (Exception ex) {
                return "Update Not Complete : " + ex.getMessage();
            }

        } else {
            return "Purchase order Update Not completed : You don't have permissing";
        }


    }



    @DeleteMapping
    @Transactional
    public String deletePorder(@RequestBody PurchaseOrder porder) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "PurchaseOrder");
        if (userPrive != null && userPrive.get("del")) {

          //  PurchaseOrder extPurchaseOrder = purchaseOrderDao.getReferenceById(porder.getId());

//            if(extPurchaseOrder == null){
//                return "Purchase order Delete Not completed : Purchase order doesn't exsites..!";
//            }
            try {

//                extPurchaseOrder.setDeletedatetime(LocalDateTime.now());
//                extPurchaseOrder.setDelete_user_id(logeduser);
//                extPurchaseOrder.setPurchase_order_status_id(purchaseOrderStatusDao.getReferenceById(4));
//
//                for (PurchaseOrderHasMaterial pohi : extPurchaseOrder.getPurchaseOrderHasMaterialList()) {
//                    pohi.setPurchase_order_id(extPurchaseOrder);
//                }
//                purchaseOrderDao.save(extPurchaseOrder);

                return "0";
            } catch (Exception ex) {
                return "Delete Not Complete : " + ex.getMessage();
            }

        } else {
            return "Purchase order Delete Not completed : You don't have permissing";
        }


    }
}
