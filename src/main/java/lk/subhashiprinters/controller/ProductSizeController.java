package lk.subhashiprinters.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.subhashiprinters.entity.ProductSize;
import lk.subhashiprinters.repository.ProductSizeRepository;

@RestController //make it available to front end 
@RequestMapping(value="/productsize")

public class ProductSizeController {

  @Autowired
  // linked required repostiory
    private ProductSizeRepository productSizeDao ; 

   //ProductSize/list
  @GetMapping(value = "list",produces = "application/json")
  public List<ProductSize> productSizeList(){
        return productSizeDao.findAll();
}

}
