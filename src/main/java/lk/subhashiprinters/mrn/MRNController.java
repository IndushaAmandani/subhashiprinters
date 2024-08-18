package lk.subhashiprinters.mrn;


import lk.subhashiprinters.material.*;
import lk.subhashiprinters.mrn.MRN;
import lk.subhashiprinters.mrn.MRNRepository;
import lk.subhashiprinters.mrn.MRNStatusRepository;
import lk.subhashiprinters.purchaseorder.POrderStatusRepository;
import lk.subhashiprinters.purchaseorder.PurchaseOrder;
import lk.subhashiprinters.purchaseorder.PurchaseOrderHasMaterial;
import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.purchaseorder.PurchaseOrderRepository;
import lk.subhashiprinters.quotation.Quotation;
import lk.subhashiprinters.quotation.QuotationHasMaterial;
import lk.subhashiprinters.quotation.QuotationRepository;
import lk.subhashiprinters.quotation.QuotationStatusRepository;
import lk.subhashiprinters.quotationrequest.QuotationRequest;
import lk.subhashiprinters.quotationrequest.QuotationRequestRepository;
import lk.subhashiprinters.quotationrequest.QuotationRequestStatus;
import lk.subhashiprinters.quotationrequest.QuotationRequestStatusRepository;
import lk.subhashiprinters.sample.Product;
import lk.subhashiprinters.sample.ProductRepository;
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
import java.time.LocalDate;
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
    private MaterialRepository daoMaterial;

    @Autowired
    private MRNStatusRepository mrnStatusDao;

//    @Autowired
//    private MRNRepository purchaseOrderHasMaterialDao;

    @Autowired
    private PurchaseOrderRepository pOrderDao;

    @Autowired
    private QuotationRepository quatationDao;

    @Autowired
    private QuotationStatusRepository quatationStatusDao;

    @Autowired
    private QuotationRequestRepository quatationRequestDao;

    @Autowired
    private QuotationRequestStatusRepository quotationRequestStatusDao;

    @Autowired
    private POrderStatusRepository porderStatusDao;

    @Autowired
    private PrivilageController privilegeController;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private MaterialInventoryRepository inventoryDao;


    @Autowired
    private ProductRepository productDao;
    @Autowired
    private InventoryStatusRepository inventoryStatusDao;

    //
    @GetMapping
    public ModelAndView mrnUI() {
        ModelAndView mrnui = new ModelAndView();
        mrnui.setViewName("mrn.html");
        return mrnui;
    }

    //get object by given id using path variable [ /purchaseorder/getbyid/{id}]


    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public MRN getByPathId(@PathVariable("id") Integer id) {
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
            return mrnDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
        else {
            List<MRN> mrnArrayList = new ArrayList<>();
            return mrnArrayList;
        }
    }

    @GetMapping(value = "/getnotpaid", produces = "application/json")
    public List<MRN> getnotpaid() {
        return mrnDao.getnotpaid();
    }

    @GetMapping(value = "/listbysupplier/{supid}", produces = "application/json")
    public List<MRN> getMRNlistbySupplier(@PathVariable("supid") Integer supid) {
        return mrnDao.getSupplierList(supid);
    }


    //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //        User logeduser = userDao.findUserByUsername(authentication.getName());
    //        HashMap<String, Boolean> userPrive = privilegeController.getPrivilageByUserModule(authentication.getName(), "PurchaseOrder");
    //


    @Transactional
    @PostMapping
    public String insMrn(@RequestBody MRN mrn) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> userPriv = privilegeController.getPrivilageByUserModule(auth.getName(), "MRN");

        if (userPriv != null && userPriv.get("ins")) {
            try {
                mrn.setAdded_user_id(loggedUser);
                mrn.setAdded_date(LocalDate.now());
                mrn.setRecieve_no(mrnDao.getNextMRNno());
                mrn.setPaidamount(BigDecimal.ZERO);
                for (MRNHasMaterial mrnhM : mrn.getMrnHasMaterialList()) {
                    mrnhM.setMaterial_recieve_note_id(mrn);
                }

                MRN newMrn = mrnDao.save(mrn);
                //set porder into  recieved
                PurchaseOrder extporder = pOrderDao.getReferenceById(mrn.getPurchase_order_id().getId());
                extporder.setPurchase_order_status_id(porderStatusDao.getReferenceById(2));

                for (PurchaseOrderHasMaterial pohm : extporder.getPurchaseOrderHasMaterialList()) {
                    pohm.setPurchase_order_id(extporder);
                }
                pOrderDao.save(extporder);


                //update Inventory
                for (MRNHasMaterial mrnhM : newMrn.getMrnHasMaterialList()) {
                    Material material = daoMaterial.getReferenceById(mrnhM.getMaterial_id().getId());
                    material.setUnit_price(mrnhM.getPurchase_price());
                    daoMaterial.save(material);

                    MaterialInventory extinventory = inventoryDao.getByMaterial(material.getId());
                    if (extinventory != null) {
                        extinventory.setAvaqty(extinventory.getAvaqty().add(mrnhM.getQuantity()));
                        extinventory.setTotalqty(extinventory.getTotalqty().add(mrnhM.getQuantity()));
                        extinventory.setInventorystatus_id(inventoryStatusDao.getReferenceById(1));
                        inventoryDao.save(extinventory);


                    } else {
                        MaterialInventory newInventory = new MaterialInventory();
                        newInventory.setMaterial_id(material);
                        newInventory.setAvaqty(mrnhM.getQuantity());
                        newInventory.setTotalqty(mrnhM.getQuantity());
                        newInventory.setRemoveqty(BigDecimal.ZERO);
                        newInventory.setInventorystatus_id(inventoryStatusDao.getReferenceById(1));
                        inventoryDao.save(newInventory);
                    }
                }
//                //change product prices
//                for(MRNHasMaterial mrnhasM : newMrn.getMrnHasMaterialList()){
//                    List<Product> productListwithMaterial =  productDao.getProductListByMaterial(mrnhasM.getMaterial_id().getId());
//                    for (Product product : productListwithMaterial){
//
//                    }
//                }
                //Test Code
//                List<Product> productsListByMatid = productDao.getProductListByMaterial(material.getId());
//                //running for loop to do changes to those products
//                for (Product productByMat : productsListByMatid) {
//                    //correcting product has material records with new values from material
//                    for (ProductHasMaterial phm : productByMat.getProductHasMaterialList()) {
//                        //checking for material which has to be changed in the product has material table
//                        if (phm.getMaterial_id().getId() == material.getId()) {
//                            //setting values for product has material unit price and line price
//                            phm.setMaterial_unit_price((material.getUnit_cost().multiply(material.getProfit_percentage().divide(new BigDecimal(100))).add(material.getUnit_cost())));
//                            phm.setMaterial_line_price(((material.getUnit_cost().multiply(material.getProfit_percentage().divide(new BigDecimal(100))).add(material.getUnit_cost()))).multiply(phm.getReq_quantity()));
//                        }
//                    }
//                    //creating a BigDecimal zero variable for product total price calculation..
//                    BigDecimal productLineTotal = BigDecimal.ZERO;
//                    for (ProductHasMaterial phasmat : productByMat.getProductHasMaterialList()) {
//                        productLineTotal = productLineTotal.add(phasmat.getMaterial_line_price());
//                        phasmat.setProduct_id(productByMat);
//                    }
//
//
//
//                }

                return "0";

            } catch (Exception e) {
                return "Insert not complete : You have following Errors.." + e.getMessage();
            }
        } else {
            return " MRN Insert Not completed : You don't have permission";

        }
    }


    @PutMapping
    public String updteMRN(@RequestBody MRN mrn) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> userPriv = privilegeController.getPrivilageByUserModule(auth.getName(), "MRN");

        if (userPriv.get("upd") == null) {
            return "Update not complete : You don't have Permission ";
        }
        try {
            mrn.setUpdate_date(LocalDate.now());
            if (mrn.getMaterial_recieve_note_status_id().getId() == 3) {
                PurchaseOrder extPOd = pOrderDao.getReferenceById(mrn.getPurchase_order_id().getId());
                extPOd.setPurchase_order_status_id(porderStatusDao.getReferenceById(5));

                for (MRNHasMaterial mrnhM : mrn.getMrnHasMaterialList()) {
                    mrnhM.setMaterial_recieve_note_id(mrn);
                }
                pOrderDao.save(extPOd);
            }
            mrnDao.save(mrn);
            return "0";

        } catch (Exception e) {
            return "Update not completed : " + e.getMessage();
        }


    }

    @DeleteMapping
    public String deletMrn(@RequestBody MRN mrn) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> userPriv = privilegeController.getPrivilageByUserModule(auth.getName(), "MRN");
        if (userPriv == null) {
            return "Delete not complete : You don't have permission";
        }


        try {
            mrn.setDelete_date(LocalDate.now());
            PurchaseOrder extPorder = pOrderDao.getReferenceById(mrn.getPurchase_order_id().getId());
            extPorder.setPurchase_order_status_id(porderStatusDao.getReferenceById(4));

            for (MRNHasMaterial mrnhM : mrn.getMrnHasMaterialList()) {
                mrnhM.setMaterial_recieve_note_id(mrn);
            }
            pOrderDao.save(extPorder);
            mrnDao.save(mrn);
            return "0";

        } catch (Exception e) {
            return "Delete not Successful :Server has following error " + e.getMessage();

        }
    }
}