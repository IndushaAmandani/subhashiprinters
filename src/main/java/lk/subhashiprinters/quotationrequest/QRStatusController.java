package lk.subhashiprinters.quotationrequest;


import lk.subhashiprinters.quotationrequest.QuotationRequestStatus;
import lk.subhashiprinters.quotationrequest.QuotationRequestStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/qrstatus")
public class QRStatusController {

    @Autowired
    private QuotationRequestStatusRepository quotationRequestStatusDao;

    // get all itemstatus list [ /supplierstatus/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<QuotationRequestStatus> quotationRequestStatuses(){
        return quotationRequestStatusDao.findAll();
    }
}
