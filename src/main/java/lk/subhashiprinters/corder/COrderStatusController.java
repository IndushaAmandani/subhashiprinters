//controller is the service provider to front end to back end vice versa
package lk.subhashiprinters.corder;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController // make it available all services to front-end
@RequestMapping(value = "/cOrderstatus") //class level mapping
public class COrderStatusController {

 @Autowired   //can also make constructor
 private COrderStatusRepository cOrderStatusDao;//as this is interface no constructor so ,have to make instance by somehow we use autowired

    //get mapping dataList for select data element [/customerstatus/list]
    @GetMapping(value ="/list", produces = "application/json")
    public List<COrderStatus> cOrderStatusList(){
        //need to check  priviledge
    return cOrderStatusDao.findAll();

 }
  

    
}
