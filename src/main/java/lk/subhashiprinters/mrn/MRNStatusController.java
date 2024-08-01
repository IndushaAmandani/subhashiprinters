package lk.subhashiprinters.mrn;


import lk.subhashiprinters.purchaseorder.PorderStatus;
import lk.subhashiprinters.purchaseorder.POrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/mrnstatus")
public class MRNStatusController {

    @Autowired
    private MRNStatusRepository mrnStatusDao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<MRNStatus> mrnStatusList(){
        return mrnStatusDao.findAll();
    }


}
