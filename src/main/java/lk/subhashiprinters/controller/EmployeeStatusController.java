package lk.subhashiprinters.controller;

import lk.subhashiprinters.entity.Employeestatus;
import lk.subhashiprinters.repository.EmployeeStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/employeestatus")
public class EmployeeStatusController {


    @Autowired
    private EmployeeStatusRepository employeeStatusDao;

    // [ /employeestatus/list]
    @GetMapping(value ="/list", produces = "application/json")

    //@GetMapping(value = "/findall" , produces = "application/json")
    public List<Employeestatus> employeestatusList(){
        return employeeStatusDao.findAll();
    }

    //define post service
    //@postMapping

    //POST = data send iin URL BODY 
    //GET = data send in URL header 
        // to catch those data we use  @REQUEST BODY
}
