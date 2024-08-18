package lk.subhashiprinters.privilege;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping(value = "/listbyuser/{username}" , produces = "application/json")
    public List<Module> moduleList(@PathVariable("username") String username){
        return moduleDao.byUsername(username);
    }
}
