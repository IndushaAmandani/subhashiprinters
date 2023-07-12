package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.*;
import lk.subhashiprinters.repository.CustomerOrderRepository;
import lk.subhashiprinters.repository.ProductionStatusRepository;
import lk.subhashiprinters.repository.UserRepository;
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
          customerOrder.setAdded_date(LocalDateTime.now());
             customerOrder.setAdded_user_id(loggedUser);
             customerOrder.setProduction_status_id(productionStatusRepository.getReferenceById(1));

             for(CustomerOrderHasProduct coh : customerOrder.getCustomerOrderHasProductList()){
                 coh.setCustomer_order_id(customerOrder);
                 coh.setCompletedqty(0);
                 coh.setProduction_status_id(productionStatusRepository.getReferenceById(1));
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



    //delete mapping for delete quotationrequest [/quotationrequest - delete]
    @DeleteMapping
    public String deleteQuotationrequest(@RequestBody QuotationRequest quotationrequest){
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return "Quotationrequest Delete Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"Quotationrequest");

        if(loggedUser != null && userPiriv.get("del")){

            QuotationRequest extQR = quotationrequestDao.getReferenceById(quotationrequest.getId());
            if(extQR == null ){
                return "Quotationrequest Delete Not completed : Quotationrequest not available";
            }

            try {
                extQR.setQuatation_req_status_id(quotationrequestStatusDao.getReferenceById(4));
             extQR.setDelete_date(LocalDateTime.now());
                quotationrequestDao.save(extQR);
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
