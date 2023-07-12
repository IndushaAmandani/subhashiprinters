package lk.subhashiprinters.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.subhashiprinters.entity.ProductCategory;
import lk.subhashiprinters.repository.ProductCategoryRepository;


@RestController //make it available to front end 
@RequestMapping(value="/productCategory")

public class ProductCategoryController {
  @Autowired
  // linked required repostiory
    private ProductCategoryRepository productCategoryDao ; 

   //productCategory/list
  @GetMapping(value = "list",produces = "application/json")
  public List<ProductCategory> productCategoryList(){
        return productCategoryDao.findAll();
    }



}

