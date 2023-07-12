package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.QuotationRequest;
import lk.subhashiprinters.entity.SupplierPaymentStatus;
import lk.subhashiprinters.entity.SupplierStatus;
import lk.subhashiprinters.entity.User;
import lk.subhashiprinters.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController //
@RequestMapping(value = "/spstatus") //Class level mapping
public class SPStatusController {

    @Autowired
    private SPStatusRepository spStatusDao;

    // get all itemstatus list [ /spstatus/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierPaymentStatus> supplierPaymentStatusList(){
        return spStatusDao.findAll();
    }

}
