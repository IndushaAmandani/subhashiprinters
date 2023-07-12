package lk.subhashiprinters.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.subhashiprinters.entity.ProductStatus;
import lk.subhashiprinters.repository.ProductStatusRepository;

@RestController
@RequestMapping(value= "/product_Status")
public class ProductStatusController {
    
    @Autowired //connecting to repo [interface]
    private ProductStatusRepository productStatusDao;//as this is interface no constructor so ,have to make instance by somehow we use autowired

    //List returning list of status from repo
    @GetMapping(value = "/list",produces= "application/json")
    public List<ProductStatus> productStatusList(){
        return productStatusDao.findAll();
    }

}
