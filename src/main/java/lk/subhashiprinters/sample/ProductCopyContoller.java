package lk.subhashiprinters.sample;

import lk.subhashiprinters.material.PaperInkTypes;
import lk.subhashiprinters.material.PaperInkTypesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/productCopy")
public class ProductCopyContoller {

    @Autowired
    private ProductCopyRepository productCopyDao;


    //get object by given id using path variable [ /productCopy/getbyid/{id}]
    @GetMapping(value = "/getbyid/{id}" , produces = "application/json")
    public ProductCopy getByPathId(@PathVariable("id")Integer id){
        return productCopyDao.getReferenceById(id);
    }

    @GetMapping(value = "/list",produces ="application/json")
    //create function
    public List<ProductCopy> productCopyfindAll(){
        return productCopyDao.findAll();
    }


}
