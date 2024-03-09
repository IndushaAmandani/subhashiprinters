package lk.subhashiprinters.sample;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


@GetMapping(value ="/getByPCategory/{pcid}",produces = "application/json")
    public List<ProductSize> getByPCategory(@PathVariable("pcid")  Integer pcid ){
      return (productSizeDao.getByPCategory(pcid));
}

}
