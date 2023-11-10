package lk.subhashiprinters.controller;


import java.util.List;

import lk.subhashiprinters.entity.PaperTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.subhashiprinters.entity.MaterialUnitType;
import lk.subhashiprinters.repository.MaterialUnitTypeRepository;

@RestController
@RequestMapping(value = "/materialUnitType")
public class MaterialUnitTypeController {
    @Autowired
    private MaterialUnitTypeRepository materialUnitTypeDao;

    @GetMapping(value = "/list",produces = "application/json")
    public List<MaterialUnitType> MaterialUnitTypeList(){

        return materialUnitTypeDao.findAll();
    }

    //Get material unit type by its category
    @GetMapping(value = "/getByMCategory/{mCid}" ,produces = "application/json")
    public List<MaterialUnitType> getMaterialUnitTypeByMCategory(@PathVariable("mCid") Integer mCid){
        return materialUnitTypeDao.getByMCategory(mCid);
    }




}
