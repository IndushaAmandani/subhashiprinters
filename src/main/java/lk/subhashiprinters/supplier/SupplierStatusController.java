package lk.subhashiprinters.supplier;


import lk.subhashiprinters.supplier.SupplierStatus;
import lk.subhashiprinters.supplier.SupplierStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/supplierstatus")
public class SupplierStatusController {

    @Autowired
    private SupplierStatusRepository supplierStatusDao;

    // get all itemstatus list [ /supplierstatus/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierStatus> supplierStatusList(){
        return supplierStatusDao.findAll();
    }
}
