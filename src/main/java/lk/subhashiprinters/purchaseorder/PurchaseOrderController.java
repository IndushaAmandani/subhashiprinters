package lk.subhashiprinters.purchaseorder;


import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.quotation.Quotation;
import lk.subhashiprinters.quotation.QuotationHasMaterial;
import lk.subhashiprinters.quotation.QuotationRepository;
import lk.subhashiprinters.quotation.QuotationStatusRepository;
import lk.subhashiprinters.userm.UserRepository;
import lk.subhashiprinters.userm.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/purchaseorder")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderRepository purchaseOrderDao;

    @Autowired
    private QuotationRepository quotationDao;

    @Autowired
    private POrderStatusRepository purchaseOrderStatusDao;

    @Autowired
    private PurchaseOrderHasMaterialRepository purchaseOrderHasMaterialDao;

    @Autowired
    private QuotationStatusRepository quotationStatusDao;

    @Autowired
    private PrivilageController privilegeController;

    @Autowired
    private UserRepository userDao;

    //
    @GetMapping
    public ModelAndView porderUI() {
        ModelAndView porderui = new ModelAndView();
        porderui.setViewName("porder.html");
        return porderui;
    }

    //get object by given id using path variable [ /purchaseorder/getbyid/{id}]
    @GetMapping(value = "/getbyid/{id}" , produces = "application/json")
    public PurchaseOrder getByPathId(@PathVariable("id")Integer id){
        return purchaseOrderDao.getReferenceById(id);
    }


    @GetMapping(value = "/getPObySupplierid/{id}" , produces = "application/json")
    public List<PurchaseOrder> getByPObySupplierId(@PathVariable("id")Integer id){
        return purchaseOrderDao.getPorderbySupplier(id);
    }

    @GetMapping(value = "/pOrdervalid/{sid}",produces = "application/json")
    public List<PurchaseOrder> getvalidPobysidrDate(@PathVariable("sid")Integer sid){
        //since require date retrieve as string have to convert into date type
        return purchaseOrderDao.getValidPobySupplier(sid);
    }

    @GetMapping(value ="/findall",produces = "application/json")
    //create function
    public List<PurchaseOrder> porderfindAll(){
        return purchaseOrderDao.findAll();
    }


//list
    @GetMapping(value = "/list",produces = "application/json")
    public List<PurchaseOrder> purchaseOrderList(){return purchaseOrderDao.list();}

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
                porder.setOrder_no(purchaseOrderDao.getNextPorderNo());


                for (PurchaseOrderHasMaterial pohi : porder.getPurchaseOrderHasMaterialList()) {
                    pohi.setPurchase_order_id(porder);
                }

            Quotation  existingQuotation = quotationDao.getReferenceById(porder.getQuatation_id().getId());
                existingQuotation.setQuatation_status_id(quotationStatusDao.getReferenceById(2));

                for(QuotationHasMaterial qhml : existingQuotation.getQuotationHasMaterialList()){
                  qhml.setQuatation_id(existingQuotation);
                }


                purchaseOrderDao.save(porder);

                return "0";
            } catch (Exception ex) {
                return "Insert Not Complete : " + ex.getMessage();
            }

        } else {
            return "Purchase order insert Not completed : You don't have permission";
        }

    }

    @PutMapping
    @Transactional
    public String updatePorder(@RequestBody PurchaseOrder porder) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User logeduser = userDao.findUserByUsername(authentication.getName());
        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "PurchaseOrder");
        if (userPrive != null && userPrive.get("upd")) {

            PurchaseOrder extPurchaseOrder = purchaseOrderDao.getReferenceById(porder.getId());

            if(extPurchaseOrder == null){
                return "Purchase order Update Not completed : Purchase order doesn't exsites..!";
            }
            try {

                porder.setUpdatedateitme(LocalDateTime.now());
                porder.setUpdate_user_id(logeduser);
                for (PurchaseOrderHasMaterial pohi : porder.getPurchaseOrderHasMaterialList()) {
                    pohi.setPurchase_order_id(porder);
                }
                purchaseOrderDao.save(porder);

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

            PurchaseOrder extPurchaseOrder = purchaseOrderDao.getReferenceById(porder.getId());

            if(extPurchaseOrder == null){
                return "Purchase order Delete Not completed : Purchase order doesn't exsites..!";
            }
            try {

                extPurchaseOrder.setDeletedatetime(LocalDateTime.now());
                extPurchaseOrder.setDelete_user_id(logeduser);
                extPurchaseOrder.setPurchase_order_status_id(purchaseOrderStatusDao.getReferenceById(4));

                for (PurchaseOrderHasMaterial pohi : extPurchaseOrder.getPurchaseOrderHasMaterialList()) {
                    pohi.setPurchase_order_id(extPurchaseOrder);
                }
                purchaseOrderDao.save(extPurchaseOrder);

                return "0";
            } catch (Exception ex) {
                return "Delete Not Complete : " + ex.getMessage();
            }

        } else {
            return "Purchase order Delete Not completed : You don't have permissing";
        }





    }

  //  @GetMapping(value = "/findall", produces = "application/json")
//    public List<PurchaseOrder> findAll() {
//        //need to check logged user privilage
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication instanceof AnonymousAuthenticationToken) {
//            return null;
//        }
//
//        // get logged user authentication object
//        User loggedUser = userDao.findUserByUsername(authentication.getName());
//        // check privilage for add operation
//        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "PurchaseOrder");
//
//        if (loggedUser != null && userPiriv.get("sel"))
//            return purchaseOrderDao.findAll();
//        else {
//            List<PurchaseOrder> purchaseOrderList = new ArrayList<>();
//            return purchaseOrderList;
//        }
//    }
}
