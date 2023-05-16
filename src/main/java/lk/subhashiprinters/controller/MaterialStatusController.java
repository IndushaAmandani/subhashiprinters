package lk.subhashiprinters.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.subhashiprinters.entity.MaterialStatus;
import lk.subhashiprinters.repository.MaterialStatusRepository;

@RestController //make it available all services to front- end
@RequestMapping(value = "/materialstatus")
public class MaterialStatusController {

    @Autowired //can also make constructor
private MaterialStatusRepository materialStatusDao; ///as this is interface no constructor so ,have to make instance by somehow we use autowired
    

    //get mapping dataList for select data element[/materailStatus/list]
    @GetMapping(value ="/list" , produces = "application/json")
    public List<MaterialStatus> materailStatusList(){
        // method of JPA repository which provide all data relateed to that entity  
        return materialStatusDao.findAll();

    }


    
}
