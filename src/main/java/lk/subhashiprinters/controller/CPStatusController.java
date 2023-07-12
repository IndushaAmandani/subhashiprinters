package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.CustomerPaymentStatus;
import lk.subhashiprinters.entity.SupplierPaymentStatus;
import lk.subhashiprinters.repository.CPStatusRepository;
import lk.subhashiprinters.repository.SPStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //
@RequestMapping(value = "/cpstatus") //Class level mapping
public class CPStatusController {

    @Autowired
    private CPStatusRepository cpStatusDao;

    // get all itemstatus list [ /cpstatus/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerPaymentStatus> supplierPaymentStatusList(){
        return cpStatusDao.findAll();
    }

}
