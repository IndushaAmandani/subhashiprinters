package lk.subhashiprinters.controller;

import lk.subhashiprinters.entity.Civilstatus;
import lk.subhashiprinters.entity.Module;
import lk.subhashiprinters.repository.CivilStatusRepository;
import lk.subhashiprinters.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/module")
public class ModuleController {


    @Autowired
    private ModuleRepository moduleDao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<Module> moduleList(){
        return moduleDao.findAll();
    }
}
