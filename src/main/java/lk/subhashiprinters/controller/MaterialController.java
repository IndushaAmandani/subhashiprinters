package lk.subhashiprinters.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.subhashiprinters.entity.Customer;
import lk.subhashiprinters.entity.Material;
import lk.subhashiprinters.repository.MaterialCategoryRepository;
import lk.subhashiprinters.repository.MaterialStatusRepository;
import lk.subhashiprinters.repository.MaterialUnitTypeRepository;

@RestController //make it available the services to front end and back end
@RequestMapping(value = "/material") // class level mapping 
public class MaterialController {

    @Autowired //linked required repository
    private MaterialUnitTypeRepository materialUnitDao;

    @Autowired
    private MaterialStatusRepository materialStatusDao;

    @Autowired
    private MaterialCategoryRepository materialCategoryDao;

    // create mapping for get UI
    @GetMapping
    public ModelAndView materialUI() {
        // create obj called materailUI
        ModelAndView materialUI = new ModelAndView();
        // set material to material html
        materialUI.setViewName("material.html");
        // returning ui
        return materialUI;

    }


    //request mapping for delete method[/material]
    @DeleteMapping
    public String deleteMaterial(@RequestBody Material material){
        System.out.println(material.getCode());
        return "0";
    }



    

}
