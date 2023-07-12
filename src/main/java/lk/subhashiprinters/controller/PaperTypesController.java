package lk.subhashiprinters.controller;

import java.util.List;

import lk.subhashiprinters.entity.Employee;
import lk.subhashiprinters.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import lk.subhashiprinters.entity.PaperTypes;
import lk.subhashiprinters.repository.PaperTypesRepository;

@RestController
@RequestMapping (value ="/paperTypes")
public class PaperTypesController {
    @Autowired
    private PaperTypesRepository paperTypeDao;


    // [customerstatus/list]
    @GetMapping(value ="/list", produces = "application/json")
   public List<PaperTypes> PaperTypeList(){
        return paperTypeDao.findAll();
    }


    //[getCategoryby]paperTypes/getbyCategory/
    @GetMapping(value = "/getbyCategory/{ptid}",produces = "application/json")
    public List <PaperTypes>  getByCategoryId( @PathVariable("ptid") Integer ptid){
        return paperTypeDao.getByProductCategory(ptid);
    }




}
