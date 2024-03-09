package lk.subhashiprinters.sample;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.subhashiprinters.sample.PrintColors;
import lk.subhashiprinters.sample.PrintColorsRepository;

@RestController //make it available to front end 
@RequestMapping(value="/printColors")
public class PrintColorsController {
    
    @Autowired
  // linked required repostiory
    private PrintColorsRepository printColorsDao ; 

   //productCategory/list
  @GetMapping(value = "list",produces = "application/json")
  public List<PrintColors> productCategoryList(){
        return printColorsDao.findAll();
}
}
