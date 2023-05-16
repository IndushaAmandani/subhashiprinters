package lk.subhashiprinters.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.subhashiprinters.entity.MaterialCategory;
import lk.subhashiprinters.repository.MaterialCategoryRepository;

@RestController
@RequestMapping(value = "/materialCategory")
public class MaterialCategoryController {
    
    @Autowired //
   private MaterialCategoryRepository materialCategoryDao;

   @GetMapping(value = "/list",produces = "application/json")
   private List<MaterialCategory> materailCategorysList(){
    
    return materialCategoryDao.findAll();
   }

}
