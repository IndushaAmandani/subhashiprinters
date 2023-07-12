package lk.subhashiprinters.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController //as impleent services
public class ReportUIController {

    @GetMapping(value ="/mateialListStatusReport")
    public ModelAndView mateialListStatusReport(){
        ModelAndView materialListStatusReport = new ModelAndView();
        materialListStatusReport.setViewName("MaterialListStatus.html");
    return materialListStatusReport; 

     }
}
