package lk.subhashiprinters.controller;

import lk.subhashiprinters.entity.Role;
import lk.subhashiprinters.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/role")
public class RoleController {

    @Autowired
    private RoleRepository roleDao;

    // get mapping for get all roles in database table [/role/list]
    @GetMapping(value = "/list" , produces = "application/json")
    public List<Role> roleList(){
        return roleDao.findAll();
    }

    //
    @GetMapping(value = "/listbyuser",params = {"userid"}, produces = "application/json")
    public List<Role> roleListByUser(@RequestParam("userid")Integer userid){
        return roleDao.getRoleByUser(userid);
    }
}
