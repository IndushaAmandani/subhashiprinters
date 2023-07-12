//controller is the provider

package lk.subhashiprinters.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import lk.subhashiprinters.entity.Customer;
import lk.subhashiprinters.entity.CustomerStatus;
import lk.subhashiprinters.repository.CustomerRepository;
import lk.subhashiprinters.repository.CustomerStatusRepository;
import lk.subhashiprinters.repository.CustomerTypeRepository;
import lk.subhashiprinters.repository.UserRepository;

@RestController// make it available to services to front end ,and  we don't have to create two seperate controller and rest body if we use controller we should write 
@RequestMapping(value ="/customer")//class level mapping  every mapping begin with [customer/]
public class CustomerController {
    

    @Autowired//link required repository 
    private CustomerRepository customerDao;

    
    @Autowired//link required repository 
    private UserRepository userDao;
    
    @Autowired//link required repository 
    private CustomerTypeRepository customerTypeDao;

    @Autowired
    private CustomerStatusRepository customerStatusDao;
/*-----------------------------------------------
    
    define findall data services
    create get mapping for get customer ui

   @GetMapping('/findall',produces ='application/json' )
    return all required data by findall

    define UI service['/x']
   @GetMapping('')
    privilege checking for select
    return html else return 403 html.
--------------------------------------------------------- */
        //return all required data by findall/if subsidiory then it's list 
      // -- //define findall data service['/x/findall']
//define findall data service['/customer/findall']
    @GetMapping(value ="/findall",produces = "application/json")
    //create function
    public List<Customer> findAll(){
        return customerDao.findAll();
    }

    //Create get mapping for get employee UI [/customer]
    @GetMapping
    public ModelAndView customerUI(){
      //create obj called customerUI 
      ModelAndView customerUI = new ModelAndView();
      //set cusomer html
      customerUI.setViewName("customer.html");
      //returning customerUI
      return customerUI;

    }

    @GetMapping(value = "/list",produces = "application/json")
    public List<Customer> getCustomerList(){return customerDao.listAll();}

    //dashboard [active customer count]
     @GetMapping(value = "/getActiveCustomerCount()", produces = "application/json")
     public Customer getbyActiveCustomer(){
         return customerDao.activeCustomerCount();
     }


    //get mapping service for get employee by given path variable id [ /employee/getbyid/1]
    @GetMapping(value ="/getbyid/{id}" ,produces = "application/json")
    public Customer getReferenceById(@PathVariable("id") Integer id){return customerDao.getReferenceById(id);}







          //create post mapping function for add empoyee [/employee - POST]
    @PostMapping
   public String addCustomer(@RequestBody Customer customer){
        //need to Check privilege for logged user

        
     //need to check duplicate columns values
    //check nic exist or not
        Customer extCustByMobile = customerDao.getByMobile(customer.getMobile());
        if(extCustByMobile != null){
            return "Customer insert not completed : Mobile aready Exist";
        }
        // check email exist or not
        Customer extCustByEmail = customerDao.findCustomerByEmail(customer.getCustomer_email());
        if(extCustByEmail != null){
            return "Customer insert not completed : email aready Exist";
        }

       try {
           // set auto inser value
           // employee.setNumber("00004");
           customer.setCustomer_code(customerDao.nextCustomerNumber());
            customer.setAdded_date(LocalDateTime.now());
         
            customer.setAdded_user_id(userDao.getReferenceById(1));
         
            customer.setCustomer_type_id(customerTypeDao.getReferenceById(2));

            // save operator
            customerDao.save(customer);

           // Need update dependency module

           return "0";
       }catch (Exception ex){
           return "Customer insert not completed : " + ex.getMessage();
       }


    }

    @DeleteMapping
public String deleteCustomer(@RequestBody Customer customer){
    
   Customer insCustomer  =  customerDao.getReferenceById(customer.getId());
   if(insCustomer != null){

    try{
        //now() is a  static type so have to call with class 
        insCustomer.setDelete_date(LocalDateTime.now());
        //getting the whole instance by getReference
        insCustomer.setCustomerstatus_id(customerStatusDao.getReferenceById(2));
        customerDao.save(insCustomer);
        return "0";
    }catch(Exception ex){
        return "";

    }

   }else{
        return "Delete Not Complete :   Customer doesn't exist" ;
   }
   
}

    @PutMapping
    public String updateCustomer(@RequestBody Customer customer){
       // customerDao.getReferenceById(customer.getId());
        return "0";
    }

}


