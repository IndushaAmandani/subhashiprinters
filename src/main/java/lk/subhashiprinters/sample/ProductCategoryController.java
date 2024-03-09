package lk.subhashiprinters.sample;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.*;


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


    @Entity //map into persistenet object
    @Table(name = "product_status") // mapping for table
    @Data //For getters and setters
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductStatus {
        @Id
        @GeneratedValue(strategy =  GenerationType.IDENTITY)
        @Column(name = "id")
        private Integer id ;

        @Column(name = "name")
        private String name;

    }
}

