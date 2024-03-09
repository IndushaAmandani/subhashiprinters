package lk.subhashiprinters.sample;


import lk.subhashiprinters.sample.ProductHasMaterial;
import lk.subhashiprinters.sample.ProductHasMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //
@RequestMapping(value = "/productHasMaterial") //Class level mapping
public class ProductHasMaterialController {

    @Autowired
    private ProductHasMaterialRepository productHasMaterialDao;

    // get all itemstatus list [ /cptype/list]
    @GetMapping(value = "/findall", produces = "application/json")
    public List<ProductHasMaterial> findAll(){
        return productHasMaterialDao.findAll();
    }

}
