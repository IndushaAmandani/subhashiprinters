package lk.subhashiprinters.controller;

import lk.subhashiprinters.entity.Civilstatus;
import lk.subhashiprinters.repository.CivilStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/civilstatus")
public class CivilStatusController {


    @Autowired
    private CivilStatusRepository civilStatusDao;

    // [ /civilstatus/list]
    @GetMapping(value = "/list" , produces = "application/json")
    public List<Civilstatus> civilstatusList(){
        return civilStatusDao.findAll();
    }
}
