package lk.subhashiprinters.material;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/materialCategory")
public class MaterialCategoryController {
    
    @Autowired //
   private MaterialCategoryRepository materialCategoryDao;
   @Autowired //
   private MaterialUnitTypeRepository materialUnitTypeDao;

   @GetMapping(value = "/list",produces = "application/json")
   private List<MaterialCategory> materailCategorysList(){
    
    return materialCategoryDao.findAll();
   }

 

}
