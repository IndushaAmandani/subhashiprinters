package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.Quotation;
import lk.subhashiprinters.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController //as impleent services
public class ReportDataController {

    @Autowired
    private ReportRepository reportRepository;

    @GetMapping(value ="/customerPaymentreport/bysdateedate/{sdate}/{edate}/{type}",produces ="application/json")
        public List getCPaymentbySDateEDate(@PathVariable("sdate") String sdate ,@PathVariable("edate") String edate,@PathVariable("type")String type){return reportRepository.getPaymentReport(sdate,edate);}
    }

//
//    @GetMapping(value ="/customerPaymentreport/bysdateedate",params ={"sdate","edate"},produces ="application/json"){
//        public List getCPaymentbySDateEDate(@RequestParam("sdate") String sdate,
//           @RequestParam("edate") String edate){
//            return reportRepository.getPaymentReport(sdate,edate);
//        }
//    }




