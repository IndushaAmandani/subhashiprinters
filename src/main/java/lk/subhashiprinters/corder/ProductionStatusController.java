package lk.subhashiprinters.corder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping (value ="/productionStatus")
public class ProductionStatusController {
    @Autowired
   private ProductionStatusRepository productionStatusDao;


    // [customerstatus/list]
    @GetMapping(value ="/list", produces = "application/json")
   public List<ProductionStatus> ProductionStatus(){return productionStatusDao.findAll();}


//    //[getCategoryby]paperTypes/getbyCategory/
//    @GetMapping(value = "/getbyCategory/{ptid}",produces = "application/json")
//    public List <PaperTypes>  getByCategoryId( @PathVariable("ptid") Integer ptid){
//        return paperTypeDao.getByProductCategory(ptid);
//    }




}
