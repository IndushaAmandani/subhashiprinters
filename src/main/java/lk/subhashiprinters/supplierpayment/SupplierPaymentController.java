package lk.subhashiprinters.supplierpayment;


import lk.subhashiprinters.mrn.MRN;
import lk.subhashiprinters.mrn.MRNHasMaterial;
import lk.subhashiprinters.mrn.MRNRepository;
import lk.subhashiprinters.mrn.MRNStatusRepository;
import lk.subhashiprinters.purchaseorder.POrderStatusRepository;
import lk.subhashiprinters.purchaseorder.PurchaseOrder;
import lk.subhashiprinters.purchaseorder.PurchaseOrderHasMaterial;
import lk.subhashiprinters.purchaseorder.PurchaseOrderRepository;
import lk.subhashiprinters.quotation.Quotation;
import lk.subhashiprinters.quotation.QuotationRepository;
import lk.subhashiprinters.quotation.QuotationStatusRepository;
import lk.subhashiprinters.quotationrequest.QuotationRequest;
import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.supplier.SupplierRepository;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController //
@RequestMapping(value = "/supplierpayment") //Class level mapping
public class SupplierPaymentController {

    @Autowired // for create instance
    private SupplierPaymentRepository supplierpaymentDao;
    @Autowired
    private SupplierRepository supplierDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilegeController;

    @Autowired
    private MRNRepository mrnDao;

    @Autowired
    private MRNStatusRepository mrnstatusDao;

    @Autowired
    private PurchaseOrderRepository porderDao;
    @Autowired
    private QuotationRepository quatationDao;
    @Autowired
    private QuotationStatusRepository quatationStatusDao;

    @Autowired
    private POrderStatusRepository porderStatusDao;


    //get quotationrequest UI [/quotationrequest]
    @GetMapping
    public ModelAndView supplierpaymentUI() {
        ModelAndView supplierpaymentView = new ModelAndView();
        supplierpaymentView.setViewName("supplierpayment.html");

        return supplierpaymentView;
    }


    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public SupplierPayment getByPathId(@PathVariable("id") Integer id) {
        return supplierpaymentDao.getReferenceById(id);
    }

    // get mapping for get quotationrequest selected columns details [/quotationrequest/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<SupplierPayment> supplierPaymentFindAll() {
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "SupplierPayment");

        if (loggedUser != null && userPiriv.get("sel"))
            return supplierpaymentDao.findAll();
        else {
            List<SupplierPayment> supplierPaymentList = new ArrayList<>();
            return supplierPaymentList;
        }

    }


    //post mapping for insert item [/item - post]
    @Transactional
    @PostMapping
    public String insertSupplierP(@RequestBody SupplierPayment supplierPayment) {
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return "Supplier Payemnt Insert Not completed : You don't have permission";
        }
        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "SupplierPayment");

        if (loggedUser != null && userPiriv.get("ins")) {
            // user has privilage for insert item

            try {
                // set auto set value
                supplierPayment.setAdded_date(LocalDateTime.now());
                supplierPayment.setAdded_user_id(loggedUser);
                supplierPayment.setBill_no(supplierpaymentDao.getNextSupplierPaymentID());


                //do the requeired operation
                MRN extmrn = mrnDao.getReferenceById(supplierPayment.getMaterial_recieve_note_id().getId());
                PurchaseOrder extPorder = porderDao.getReferenceById(extmrn.getPurchase_order_id().getId());
                Quotation extQuatation = quatationDao.getReferenceById(extmrn.getPurchase_order_id().getQuatation_id().getId());
                if (supplierPayment.getSupplier_payment_status_id().getId() == 1) {
                    extmrn.setMaterial_recieve_note_status_id(mrnstatusDao.getReferenceById(2));
                    extPorder.setPurchase_order_status_id(porderStatusDao.getReferenceById(5));
                    extQuatation.setQuatation_status_id(quatationStatusDao.getReferenceById(2));
                } else if (supplierPayment.getSupplier_payment_status_id().getId() == 2) {
                    extmrn.setMaterial_recieve_note_status_id(mrnstatusDao.getReferenceById(3));
                }
                //Check whether amounts are getting null if so,then assign BigDecimal Zero value to avoid nullpoint exception
                                                   //condition true :false
                BigDecimal paidamountMRN = extmrn.getPaidamount().add(supplierPayment.getPaid_amount());
                extmrn.setPaidamount(paidamountMRN);
               for(MRNHasMaterial mrnhm :extmrn.getMrnHasMaterialList()) {
                   mrnhm.setMaterial_recieve_note_id(extmrn);
               }

               for(PurchaseOrderHasMaterial poham : extPorder.getPurchaseOrderHasMaterialList()){
                   poham.setPurchase_order_id(extPorder);
               }
                porderDao.save(extPorder);
                mrnDao.save(extmrn);
                supplierpaymentDao.save(supplierPayment);
                return "0";
            } catch (Exception ex) {
                return "Supplier Payment Insert Not completed : " + ex.getMessage();
            }


        } else {
            return "Supplier Payment  Insert Not completed : You don't have permission";
        }


    }

    /*//update mapping for update quotationrequest [/quotationrequest - update]
    @PutMapping
    @Transactional
    public String updateQuotationrequest(@RequestBody QuotationRequest quotationrequest){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Quotationrequest Update Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Quotationrequest");

        if(loggedUser != null && userPiriv.get("upd")){

            QuotationRequest extqr = quotationrequestDao.getReferenceById(quotationrequest.getId());
            if(extqr == null && !extqr.getRequest_number().equals(quotationrequest.getRequest_number())){
                return "Quotationrequest Update Not completed : Quotationrequest not available";
            }

            try {

                quotationrequest.setUpdate_date(LocalDateTime.now());
                quotationrequestDao.save(quotationrequest);
                return "0";
            }catch (Exception exception){
                return "Quotationrequest Update Not completed : " + exception.getMessage();
            }
        }else {
            return "Quotationrequest Update Not completed : You don't have permissing";
        }
    }



    //delete mapping for delete supplierPayment [/quotationrequest - delete]
    @DeleteMapping
    public String deleteSypplierPayment(@RequestBody SupplierPayment supplierPayment){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "SupplierPayment Delete Not completed : You don't have permission";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"SupplierPayment");

        if(loggedUser != null && userPiriv.get("del")){

            SupplierPayment extSup = supplierpaymentDao.getReferenceById(supplierPayment.getId());
            if(extSup == null ){
                return "Supplier Payment Delete Not completed : Supplier Payment not available";
            }

            try {

               //if supplier payment is deleted

                extSup.setDelete_date(LocalDateTime.now());
                extSup.setDelete_user_id(loggedUser);


                return "0";
            }catch (Exception exception){
                return "Quotationrequest Delete Not completed : " + exception.getMessage();
            }
        }else {
            return "Quotationrequest Delete Not completed : You don't have permissing";
        }
    }
*/


}
