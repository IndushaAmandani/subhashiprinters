package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.Customer;
import lk.subhashiprinters.entity.CustomerPaymentStatus;
import lk.subhashiprinters.entity.DailyProduct;
import lk.subhashiprinters.repository.CPStatusRepository;
import lk.subhashiprinters.repository.DailyProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RestController //as providing services
@RequestMapping(value = "/dailyProduct") //Class level mapping
public class DailyProductController {

    @Autowired
    private DailyProductRepository dailyProductDao;

    // get all itemstatus list [ /cpstatus/list]
    @GetMapping(value = "/findall", produces = "application/json")
 public List<DailyProduct> findAll(){return dailyProductDao.findAll();}

    @GetMapping
    public ModelAndView dailyPUI(){
        //create obj called customerUI
        ModelAndView dailyPUI = new ModelAndView();
        //set cusomer html
        dailyPUI.setViewName("dailyProduct.html");
        //returning customerUI
        return dailyPUI;

    }

}
