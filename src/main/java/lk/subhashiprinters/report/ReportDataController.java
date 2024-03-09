package lk.subhashiprinters.report;



import lk.subhashiprinters.cpayment.CPaymentReport;
import lk.subhashiprinters.report.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController //as impleent services
public class ReportDataController {

    @Autowired
    private ReportRepository reportRepository;

    @GetMapping(value ="/customerPaymentreport/bysdateedate/{sdate}/{edate}/{type}",produces ="application/json")
        public List<CPaymentReport> getCPaymentbySDateEDate(@PathVariable("sdate") String sdate ,@PathVariable("edate") String edate,@PathVariable("type")String type) {

        String[][] reportDataList = new String[100][4];
        if(type.equals("Daily"))
            reportDataList = reportRepository.getPaymentReportDaily(sdate, edate);
        if(type.equals("Weekly"))
            reportDataList = reportRepository.getPaymentReportWeekly(sdate, edate);
        if(type.equals("Monthly"))
            reportDataList = reportRepository.getPaymentReportMonthly(sdate, edate);
        if(type.equals("Annualy"))
            reportDataList = reportRepository.getPaymentReportAnnualy(sdate, edate);
        List<CPaymentReport> paymentReportsList  = new ArrayList<>();

       for (int i = 0; i < reportDataList.length; i++) {
          CPaymentReport cPaymentReport = new CPaymentReport();
           if(type.equals("Annualy"))
               cPaymentReport.setDate(reportDataList[i][0]);
           else
             cPaymentReport.setDate(reportDataList[i][0] + "-" + reportDataList[i][1]);

           cPaymentReport.setCpaymentcount(reportDataList[i][2]);
            cPaymentReport.setTotalamount(reportDataList[i][3]);


         paymentReportsList.add(cPaymentReport);
  }

return paymentReportsList;
    }






    }

//
//    @GetMapping(value ="/customerPaymentreport/bysdateedate",params ={"sdate","edate"},produces ="application/json"){
//        public List getCPaymentbySDateEDate(@RequestParam("sdate") String sdate,
//           @RequestParam("edate") String edate){
//            return reportRepository.getPaymentReport(sdate,edate);
//        }
//    }




