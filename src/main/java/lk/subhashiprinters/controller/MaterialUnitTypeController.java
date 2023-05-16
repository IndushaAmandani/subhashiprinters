package lk.subhashiprinters.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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
    
}
