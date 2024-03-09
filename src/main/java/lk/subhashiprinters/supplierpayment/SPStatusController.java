package lk.subhashiprinters.supplierpayment;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //
@RequestMapping(value = "/spstatus") //Class level mapping
public class SPStatusController {

    @Autowired
    private SPStatusRepository spStatusDao;

    // get all itemstatus list [ /spstatus/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<SPaymentStatus> supplierPaymentStatusList(){
        return spStatusDao.findAll();
    }

}
