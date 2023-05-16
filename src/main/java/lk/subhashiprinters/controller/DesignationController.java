package lk.subhashiprinters.controller;

import lk.subhashiprinters.entity.Designation;
import lk.subhashiprinters.repository.DesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/designation")
public class DesignationController {


    @Autowired
    private DesignationRepository designationDao;

    // [ /designation/list]
    @GetMapping(value = "/list" , produces = "application/json")
    public List<Designation> designationList(){
        return designationDao.findAll();
    }
}
