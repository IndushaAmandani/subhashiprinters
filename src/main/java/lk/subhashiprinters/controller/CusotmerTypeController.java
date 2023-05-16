package lk.subhashiprinters.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lk.subhashiprinters.entity.CustomerType;
import lk.subhashiprinters.repository.CustomerTypeRepository;

@RestController
@RequestMapping (value ="/customerType")
public class CusotmerTypeController {
    
    @Autowired
    private CustomerTypeRepository customerTypeDao;

    // [customerstatus/list]
    @GetMapping(value ="/list", produces = "application/json")
   public List<CustomerType> customerTypeList(){
        return  customerTypeDao.findAll();
    }


}
