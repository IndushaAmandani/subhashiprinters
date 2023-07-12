package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.CustomerPaymentType;
import lk.subhashiprinters.entity.SupplierPaymentType;
import lk.subhashiprinters.repository.CPTypeRepository;
import lk.subhashiprinters.repository.SPTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //
@RequestMapping(value = "/cptype") //Class level mapping
public class CPTypeController {

    @Autowired
    private CPTypeRepository cpTypeDao;

    // get all itemstatus list [ /cptype/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerPaymentType> customerPaymentTypes(){
        return cpTypeDao.findAll();
    }

}
