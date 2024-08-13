package lk.subhashiprinters.dailyproduct;


import lk.subhashiprinters.corder.*;
import lk.subhashiprinters.dailyproduct.ProductionOrderConfirmRepository;
import lk.subhashiprinters.material.InventoryStatusRepository;
import lk.subhashiprinters.material.MaterialInventory;
import lk.subhashiprinters.material.MaterialInventoryRepository;
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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController //
@RequestMapping(value = "/productoinOrderConfirm") //Class level mapping
public class ProductionOrderConfirmController {

    @Autowired // for create instance
    private ProductionOrderConfirmRepository productionOrderConfirmDao;

    @Autowired // for create instance
    private COrderStatusRepository COrderSatatusDao;

    @Autowired // for create instance
    private CustomerOrderRepository customerOrderDao;
    @Autowired // for create instance
    private ProductionStatusRepository productionStatusRepository;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilegeController;

    @Autowired
    private MaterialInventoryRepository materialInventoryRepository;

    @Autowired
    private InventoryStatusRepository inventoryStatusRepository;



    //get quotationrequest UI [/quotationrequest]
    @GetMapping
    public ModelAndView POrderCnfirmUI(){
        ModelAndView productionOrderConfirm = new ModelAndView();
        productionOrderConfirm.setViewName("productionOrderConfirm.html");

        return productionOrderConfirm;
    }


    @GetMapping(value ="/findbyStatus",produces = "application/json")
    //create function
    public List<CustomerOrder> findbyStatus(){
        return productionOrderConfirmDao.findbyStatus();
    }

    @GetMapping(value ="/getbyid/{id}" ,produces = "application/json")
    public CustomerOrder getByPathId(@PathVariable("id") Integer id){
        return productionOrderConfirmDao.getReferenceById(id);
    }



/*
   // get mapping for get customerOrder selected columns details [/customerOrder/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<CustomerOrder> POrderConfirmFindAll(){
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"CustomerOrder");

        if(loggedUser != null && userPiriv.get("sel"))
            return productionOrderConfirmDao.findAll();
        else{
            List<CustomerOrder> customerOrderList = new ArrayList<>();
            return customerOrderList;
        }/*

    }


    //get mapping for get corder details for  daily product
  /*  @GetMapping(value = "/list",produces = "application/json")
    public  List<CustomerOrder> list(){return CustomerOrderDao.list();}
*/
//@GetMapping(value ="/pendingOrders",produces = "application/json")
//    public CustomerOrder getPendingCustomerOrders(){return CustomerOrderDao.pendingCustomerOrders();}
//

    //post mapping for insert item [/item - post]
    @Transactional
   @PostMapping
    public String insertCOrder(@RequestBody CustomerOrder customerOrder){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Customer Order Status Insert Not completed : You don't have permission";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"ProductionConfirmation");

        if(loggedUser != null && userPiriv.get("upd")){
            // user has privilage for insert item

            CustomerOrder extCustomerOrder = customerOrderDao.getByProductionStatus(customerOrder.getId());
            if(extCustomerOrder != null){
                return "Customer Order Confirmation Not completed : Given Customer order Allready Accepted";
            }

            try {
                // set auto set value
             customerOrder.setConfirmdate(LocalDate.now());
             customerOrder.setUpdate_user_id(loggedUser);
             customerOrder.setProduction_status_id(productionStatusRepository.getReferenceById(2));

             for(CustomerOrderHasProduct coh : customerOrder.getCustomerOrderHasProductList()){
                 coh.setCustomer_order_id(customerOrder);
                 coh.setProduction_status_id(productionStatusRepository.getReferenceById(2));
             }

                for(CustomerOrderHasMaterial cohm : customerOrder.getCustomerOrderHasMaterialList()){
                    cohm.setCustomer_order_id(customerOrder);

                }

                customerOrderDao.save(customerOrder);



//                for(CustomerOrderHasMaterial cohm : customerOrder.getCustomerOrderHasMaterialList()){
//                    MaterialInventory materialInventory = materialInventoryRepository.getByMaterial(cohm.getMaterial_id().getId());
//
//                    if(materialInventory != null){
//                        materialInventory.setAvaqty(materialInventory.getAvaqty().subtract(cohm.getRequired_quantity()));
//                        if(materialInventory.getAvaqty().equals(BigDecimal.valueOf(0.000))){
//                            materialInventory.setInventorystatus_id(inventoryStatusRepository.getReferenceById(2));
//                        }
//                        materialInventoryRepository.save(materialInventory);
//                    }
//
//                }

                return "0";
            }catch (Exception ex){
                return "Customer Order Status Insert Not completed : " + ex.getMessage();
            }


        }
        else {
            return "Customer Order Status Insert Insert Not completed : You don't have permission";
        }


    }
    /*
    //update mapping for update quotationrequest [/quotationrequest - update]
//    @PutMapping
//    @Transactional
//    public String updateQuotationrequest(@RequestBody QuotationRequest quotationrequest){
//        // neeed to check logged user privilage
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if(authentication instanceof AnonymousAuthenticationToken){
//            return "Quotationrequest Update Not completed : You don't have permissing";
//        }
//
//        // get logged user authentication object
//        User loggedUser = userDao.findUserByUsername(authentication.getName());
//        // check privilage for add operation
//        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Quotationrequest");
//
//        if(loggedUser != null && userPiriv.get("upd")){
//
//            QuotationRequest extqr = quotationrequestDao.getReferenceById(quotationrequest.getId());
//            if(extqr == null && !extqr.getRequest_number().equals(quotationrequest.getRequest_number())){
//                return "Quotationrequest Update Not completed : Quotationrequest not available";
//            }
//
//            try {
//
//                quotationrequest.setUpdate_date(LocalDateTime.now());
//                quotationrequestDao.save(quotationrequest);
//                return "0";
//            }catch (Exception exception){
//                return "Quotationrequest Update Not completed : " + exception.getMessage();
//            }
//        }else {
//            return "Quotationrequest Update Not completed : You don't have permissing";
//        }
//    }


/*
    //delete mapping for delete quotationrequest [/quotationrequest - delete]
    @DeleteMapping
    public String deleteCOrder(@RequestBody CustomerOrder customerOrder){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Customer Order Delete Not completed : You don't have permissing";
        }

       // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
   // check privilage for add operation
    HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"CustomerOrder");

        if(loggedUser != null && userPiriv.get("del")){

            CustomerOrder extCO = CustomerOrderDao.getReferenceById(customerOrder.getId());
            if(extCO == null ){
                return "Customer  Order Delete Not completed : Customer Order not available";
            }

            try {
                extCO.setOrder_status_id(COrderSatatusDao.getReferenceById(3));
                extCO.setDeleted_date(LocalDateTime.now());
               CustomerOrderDao.save(extCO);
                return "0";
            }catch (Exception exception){
                return "Customer Order Delete Not completed : " + exception.getMessage();
            }
        }else {
            return "Customer Order Delete Not completed : You don't have permissing";
        }
    }
*/


}
