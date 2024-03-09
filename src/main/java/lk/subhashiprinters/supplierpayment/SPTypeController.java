package lk.subhashiprinters.supplierpayment;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //
@RequestMapping(value = "/sptype") //Class level mapping
public class SPTypeController {

    @Autowired
    private SPTypeRepository spTypeDao;

    // get all itemstatus list [ /sptype/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<SPaymentType> supplierPaymentTypes(){
        return spTypeDao.findAll();
    }

}
