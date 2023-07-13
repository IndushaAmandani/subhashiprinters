package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.*;
import lk.subhashiprinters.repository.CustomerPaymentRepository;
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
@RequestMapping(value = "/cpayment") //Class level mapping
public class CustomerPaymentController {

    @Autowired // for create instance
    private CustomerPaymentRepository customerpaymentDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilegeController;




    @GetMapping
    public ModelAndView customerpaymentUI(){
        ModelAndView customerpaymentView = new ModelAndView();
        customerpaymentView.setViewName("cpayment.html");

        return customerpaymentView;
    }


    //get object by given id using path variable [ /supplier/getbyid/{id}]
    @GetMapping(value = "/getbyid/{id}" , produces = "application/json")
    public CustomerPayment getByPathId(@PathVariable("id")Integer id){
        return customerpaymentDao.getReferenceById(id);
    }

    //privilage- slect,insrt,updt,updt,deltt
    // get mapping for get  selected columns details [//findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<CustomerPayment> quotationrequestFindAll(){
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication instanceof AnonymousAuthenticationToken){
            return null;
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"CustomerPayment");

        if(loggedUser != null && userPiriv.get("sel"))
            return customerpaymentDao.findAll();
        else{
            List<CustomerPayment> customerPaymentList = new ArrayList<>();
            return customerPaymentList;
        }

    }


  //post mapping for insert customer Pyament [/spayment - post]
@PostMapping
public String insertSuppler(@RequestBody CustomerPayment customerPayment){
    // neeed to check logged user privilage
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if(authentication instanceof AnonymousAuthenticationToken){
        return "Customer Payment Insert Not completed : You don't have permissing";
    }

    // get logged user authentication object
    User loggedUser = userDao.findUserByUsername(authentication.getName());
    // check privilage for add operation
    HashMap<String,Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(),"CustomerPayment");

    if(loggedUser != null && userPiriv.get("ins")){
        // user has privilage for insert item

        try {
            // set auto set value
            customerPayment.setAdded_date(LocalDateTime.now());
            customerPayment.setCustomer_payment_bill_number(customerpaymentDao.getNextCustomerPaymentBillNo());
            customerPayment.setAdded_user_id(loggedUser);

            //do the requeired operation
            customerpaymentDao.save(customerPayment);

            return "0";
        }catch (Exception ex){
            return "Customer Payment Insert Not completed : " + ex.getMessage();
        }


    }
    else {
        return "Customer Payment Insert Not completed : You don't have permissing";
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
