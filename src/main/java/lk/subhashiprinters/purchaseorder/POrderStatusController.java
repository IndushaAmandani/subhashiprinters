package lk.subhashiprinters.purchaseorder;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/porderstatus")
public class POrderStatusController {

    @Autowired
    private POrderStatusRepository porderStatusDao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<PorderStatus> porderStatusList(){
        return porderStatusDao.findAll();
    }


}
