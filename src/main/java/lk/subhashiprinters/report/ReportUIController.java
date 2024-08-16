package lk.subhashiprinters.report;


import lk.subhashiprinters.material.MaterialInventory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController //as impleent services
public class ReportUIController {

    @GetMapping(value = "/mateialListStatusReport")
    public ModelAndView mateialListStatusReport() {
        ModelAndView materialListStatusReport = new ModelAndView();
        materialListStatusReport.setViewName("MaterialListStatus.html");
        return materialListStatusReport;

    }

    @GetMapping(value = "/customerPaymentreport")
    public ModelAndView invoiceReport() {
        ModelAndView invoiceReportView = new ModelAndView();
        invoiceReportView.setViewName("CustomerPayment.html");
        return invoiceReportView;

    }

    @GetMapping(value = "/supplierPaymentreport")
    public ModelAndView invoiceSReport() {
        ModelAndView invoiceSReportView = new ModelAndView();
        invoiceSReportView.setViewName("supplierPaymentReport.html");
        return invoiceSReportView;

    }

    @GetMapping(value = "/samplechart")
    public ModelAndView samplechartUI() {
        ModelAndView samplechartView = new ModelAndView();
        samplechartView.setViewName("corderChart.html");
        return samplechartView;

    }


}

