package lk.subhashiprinters.corder;


import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.userm.UserRepository;
import lk.subhashiprinters.userm.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController //
@RequestMapping(value = "/customerOrder") //Class level mapping
public class CustomerOrderController {

    @Autowired // for create instance
    private CustomerOrderRepository CustomerOrderDao;

    @Autowired // for create instance
    private COrderStatusRepository COrderSatatusDao;
    @Autowired // for create instance
    private ProductionStatusRepository productionStatusRepository;

    @Autowired
    private UserRepository userDao;


    @Autowired
    private PrivilageController privilegeController;



    //get quotationrequest UI [/quotationrequest]
    @GetMapping
    public ModelAndView customerOrderUI(){
        ModelAndView customerOrderView = new ModelAndView();
        customerOrderView.setViewName("corder.html");

        return customerOrderView;
    }




    // get mapping for get customerOrder selected columns details [/customerOrder/findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<CustomerOrder> quotationrequestFindAll(){
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
            return CustomerOrderDao.findAll();
        else{
            List<CustomerOrder> customerOrderList = new ArrayList<>();
            return customerOrderList;
        }

    }


    //get mapping for get corder details for  daily product
    @GetMapping(value = "/list",produces = "application/json")
    public  List<CustomerOrder> list(){return CustomerOrderDao.list();}

    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public CustomerOrder getReferenceById(@PathVariable("id") Integer id) {return CustomerOrderDao.getReferenceById(id);}

//Customer Payment to be paid customer Order Numbers
    @GetMapping(value = "/getActivePayCOrders/{cid}",produces = "application/json")
    public List<CustomerOrder> getpaymentPendingCustomers(@PathVariable("cid") Integer cid){return CustomerOrderDao.getNotPaidCustomers(cid);}

    @GetMapping(value ="/notpaidCustomers",produces = "application/json")
    public List<CustomerOrder> getNotPyCustomerOrders(){return CustomerOrderDao.getNotpaidList();}

@GetMapping(value ="/pendingOrders",produces = "application/json")
    public CustomerOrder getPendingCustomerOrders(){return CustomerOrderDao.pendingCustomerOrders();}


    //post mapping for insert item [/item - post]
    @PostMapping
    public String insertCOrder(@RequestBody CustomerOrder customerOrder){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Customer Order Insert Not completed : You don't have permission";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"CustomerOrder");

        if(loggedUser != null && userPiriv.get("ins")){
            // user has privilage for insert item

            try {
                // set auto set value
                customerOrder.setOrder_code(CustomerOrderDao.getNextPorderNo());
                customerOrder.setOrder_status_id(COrderSatatusDao.getReferenceById(1));
          customerOrder.setAdded_date(LocalDateTime.now());
             customerOrder.setAdded_user_id(loggedUser);
             customerOrder.setProduction_status_id(productionStatusRepository.getReferenceById(1));
             customerOrder.setOrder_balance(customerOrder.getTotal_amount());

                System.out.println(customerOrder);

             for(CustomerOrderHasProduct coh : customerOrder.getCustomerOrderHasProductList()){
                 coh.setCustomer_order_id(customerOrder);
                 coh.setCompletedqty(0);
                 coh.setProduction_status_id(productionStatusRepository.getReferenceById(1));
             }

                for(CustomerOrderHasMaterial cohm : customerOrder.getCustomerOrderHasMaterialList()){
                    cohm.setCustomer_order_id(customerOrder);

                }

                CustomerOrderDao.save(customerOrder);

                return "0";
            }catch (Exception ex){
                return "Customer Order Insert Not completed : " + ex.getMessage();
            }


        }
        else {
            return "Customer Order Insert Insert Not completed : You don't have permission";
        }


    }

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

                for(CustomerOrderHasProduct coh : extCO.getCustomerOrderHasProductList()){
                    coh.setCustomer_order_id(extCO);

                }

                for(CustomerOrderHasMaterial cohm : extCO.getCustomerOrderHasMaterialList()){
                    cohm.setCustomer_order_id(extCO);

                }
               CustomerOrderDao.save(extCO);
                return "0";
            }catch (Exception exception){
                return "Customer Order Delete Not completed : " + exception.getMessage();
            }
        }else {
            return "Customer Order Delete Not completed : You don't have permissing";
        }
    }



}
