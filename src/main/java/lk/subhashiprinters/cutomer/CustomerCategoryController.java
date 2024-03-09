package lk.subhashiprinters.cutomer;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lk.subhashiprinters.cutomer.CustomerCategory;
import lk.subhashiprinters.cutomer.CustomerCategoryRepository;


@RestController //make it available to front end and we don't have to create two seperate controller if we have to access REST  body 
@RequestMapping(value = "/customerCategory")//class level mapping  every mapping begin with [customer/]
public class CustomerCategoryController {

    @Autowired//link required repository 
    private CustomerCategoryRepository customerCategoryDao ;

    //for list
    @GetMapping(value="/list",produces = "application/json")
    public List<CustomerCategory> customerCategoryList(){
        return customerCategoryDao.findAll();
    }


    
}

