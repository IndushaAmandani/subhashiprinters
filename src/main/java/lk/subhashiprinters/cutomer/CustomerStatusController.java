//controller is the service provider to front end to back end vice versa
package lk.subhashiprinters.cutomer;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.subhashiprinters.cutomer.CustomerStatus;
import lk.subhashiprinters.cutomer.CustomerStatusRepository;

@RestController // make it available all services to front-end
@RequestMapping(value = "/customerstatus") //class level mapping
public class CustomerStatusController {

 @Autowired   //can also make constructor
 private CustomerStatusRepository customerStatusDao;//as this is interface no constructor so ,have to make instance by somehow we use autowired

    //get mapping dataList for select data element [/customerstatus/list]
    @GetMapping(value ="/list", produces = "application/json")
    public List<CustomerStatus> customerStatusList(){
        //need to check  priviledge
    return customerStatusDao.findAll();

 }
  

    
}
