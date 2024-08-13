package lk.subhashiprinters.cpayment;


import lk.subhashiprinters.corder.*;
import lk.subhashiprinters.cpayment.CustomerPayment;
import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.cpayment.CustomerPaymentRepository;
import lk.subhashiprinters.userm.UserRepository;
import lk.subhashiprinters.userm.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController //
@RequestMapping(value = "/cpayment") //Class level mapping
public class CustomerPaymentController {

    @Autowired // for create instance
    private CustomerPaymentRepository customerpaymentDao;
    @Autowired // for create instance
    private CustomerOrderRepository CustomerOrderDao;
    @Autowired // for create instance
    private COrderStatusRepository corderStatusDao;
    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilageController privilegeController;

    @Autowired // for create instance
    private ProductionStatusRepository productionStatusRepository;

    @GetMapping
    public ModelAndView customerpaymentUI() {
        ModelAndView customerpaymentView = new ModelAndView();
        customerpaymentView.setViewName("cpayment.html");

        return customerpaymentView;
    }


    //get object by given id using path variable [ /supplier/getbyid/{id}]
    @GetMapping(value = "/getbyid/{id}", produces = "application/json")
    public CustomerPayment getByPathId(@PathVariable("id") Integer id) {
        return customerpaymentDao.getReferenceById(id);
    }

    //privilage- slect,insrt,updt,updt,deltt
    // get mapping for get  selected columns details [//findall]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<CustomerPayment> quotationrequestFindAll() {
        //need to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return null;
        }


        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "CustomerPayment");

        if (loggedUser != null && userPiriv.get("sel"))
            return customerpaymentDao.findAll();
        else {
            List<CustomerPayment> customerPaymentList = new ArrayList<>();
            return customerPaymentList;
        }

    }

/*
    @GetMapping(value = "/getCustomerPaymentList",produces = "application/json")
    public List<CustomerPayment> gettoBePaymentCustomers(){return customerpaymentDao.getCustomerPaymentBy();}*/


    //post mapping for insert customer Pyament [/spayment - post]
    @PostMapping
    public String insertCpayment(@RequestBody CustomerPayment customerPayment) {
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return "Customer Payment Insert Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "CustomerPayment");

        if (loggedUser != null && userPiriv.get("ins")) {
            // user has privilage for insert item

            try {
                // set auto set value
                customerPayment.setAdded_date(LocalDateTime.now());
                customerPayment.setCustomer_payment_bill_number(customerpaymentDao.getNextCustomerPaymentBillNo());
                customerPayment.setAdded_user_id(loggedUser);

                //do the requeired operation
                customerpaymentDao.save(customerPayment);

                //Set Customer Order order balance by the settled payment
                CustomerOrder customerOrder = CustomerOrderDao.getReferenceById(customerPayment.getCustomer_order_id().getId());

                BigDecimal orderBalanceforCOrder = customerOrder.getOrder_balance();

                //Check whether this is the first payment made by the customer
                BigDecimal totalamountfortheOrder = customerOrder.getTotal_amount();
                if(orderBalanceforCOrder.compareTo(totalamountfortheOrder) ==0){
                    //set order status of Pending into initiated status
                   customerOrder.setOrder_status_id(corderStatusDao.getReferenceById(1));
                    for (CustomerOrderHasMaterial comat : customerOrder.getCustomerOrderHasMaterialList()) {
                        comat.setCustomer_order_id(customerOrder);

                    }
                    for (CustomerOrderHasProduct coh : customerOrder.getCustomerOrderHasProductList()) {
                        coh.setCustomer_order_id(customerOrder);

                    }

                    CustomerOrderDao.save(customerOrder);

                }


                BigDecimal paidamount = customerPayment.getPaid_amount();

                BigDecimal newOrderBalance = orderBalanceforCOrder.subtract(paidamount);

                customerOrder.setOrder_balance(newOrderBalance);
                System.out.println(newOrderBalance);

                Boolean orderProductionDone = true;
                //corderhas product list

                List<CustomerOrderHasProduct> productListfortheCustomerOrder = customerOrder.getCustomerOrderHasProductList();
                for (CustomerOrderHasProduct cohproduct : productListfortheCustomerOrder) {
                    if (cohproduct.getProduction_status_id().getId() != 4) {
                        orderProductionDone = false;
                        break;

                    }
                }
                //-----new BigDecimal(0)----
                //Payment completed check
                if (newOrderBalance.compareTo(BigDecimal.ZERO) == 0) {
                    if(orderProductionDone){
                        customerOrder.setOrder_status_id(corderStatusDao.getReferenceById(3));
                    }else{
                        customerOrder.setOrder_status_id(corderStatusDao.getReferenceById(2));
                    }
                }
                //Payment not completed
                if (newOrderBalance.compareTo(BigDecimal.ZERO) > 0) {
                    if(orderProductionDone){
                        customerOrder.setOrder_status_id(corderStatusDao.getReferenceById(4));
                    }else{
                        customerOrder.setOrder_status_id(corderStatusDao.getReferenceById(2));
                    }
                }

                for (CustomerOrderHasMaterial comat : customerOrder.getCustomerOrderHasMaterialList()) {
                    comat.setCustomer_order_id(customerOrder);

                }
                for (CustomerOrderHasProduct coh : customerOrder.getCustomerOrderHasProductList()) {
                    coh.setCustomer_order_id(customerOrder);

                }

                CustomerOrderDao.save(customerOrder);
                return "0";
            } catch (Exception ex) {
                return "Customer Payment Insert Not completed : " + ex.getMessage();
            }


        } else {
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
    }*/


    @DeleteMapping
    public String deleteCustomerPayment(@RequestBody CustomerPayment customerPayment) {
        System.out.println(customerPayment.getId());
        //retrieving the object from db as some of data retrun from customer
        // neeed to check logged user privilage
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AnonymousAuthenticationToken) {
            return "Customer Payment Delete Not completed : You don't have permissing";
        }

        // get logged user authentication object
        User loggedUser = userDao.findUserByUsername(authentication.getName());
        // check privilage for add operation
        HashMap<String, Boolean> userPiriv = privilegeController.getPrivilageByUserModule(loggedUser.getUsername(), "CustomerPayment");

        if (loggedUser != null && userPiriv.get("del")) {
            CustomerPayment insCustomerP = customerpaymentDao.getReferenceById(customerPayment.getId());
            if (insCustomerP != null) {

                try {
                    //now() is a  static type so have to call with class
                    insCustomerP.setDelete_date(LocalDateTime.now());
                    customerpaymentDao.save(insCustomerP);
                    return "0";
                } catch (Exception ex) {
                    return "";

                }

            } else {
                return "Delete Not Complete :   Customer doesn't exist";
            }

        } else {
            return "Customer Payment Delete Not completed : You don't have permissing";
        }
    }

}
