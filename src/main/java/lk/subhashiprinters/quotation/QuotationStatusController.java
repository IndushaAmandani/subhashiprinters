package lk.subhashiprinters.quotation;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/quotationstatus")
public class QuotationStatusController {

    @Autowired
    private QuotationStatusRepository quotationStatusDao;

    // get all itemstatus list [ /quotationstatus/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<QuotationStatus> quotationStatusList(){
        return quotationStatusDao.findAll();
    }
}
