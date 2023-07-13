package lk.subhashiprinters.controller;


import lk.subhashiprinters.entity.Employee;
import lk.subhashiprinters.repository.EmployeeRepository;
import lk.subhashiprinters.repository.EmployeeStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.List;

//
@RestController
@RequestMapping(value = "/employee") // class level mapping
public class EmployeeController {
    //Class instance making
    // String name = new String();

    //Interfaces doesn't have constructors which is auto created;
    //@Autowired is use to create instances

    @Autowired 
    private EmployeeRepository employeeDao;

    @Autowired
    private EmployeeStatusRepository employeeStatusDao;

    //create get mapping for get emplpyee ui ---> [ /employee]
    @GetMapping
    //create function for get employee UI
    public ModelAndView employeeUi(){
        //create ModelAndView object called employeeui
       ModelAndView employeeui = new ModelAndView();
       //set employee html
       employeeui.setViewName("employee.html");
        return employeeui;
    }

     //request mapping for get employee without user account
    @GetMapping(value = "/listwithoutuseraccount" , produces = "application/json")
    public List<Employee> employeeListWithoutUser(){
        return employeeDao.getEmployeeListWithoutUserAccount();
    }

    //get mapping service for get employee by given path variable id [ /employee/getbyid/1]
    @GetMapping(value ="/getbyid/{id}" ,produces = "application/json")
    public Employee getEmployeeByPVId(
            @PathVariable("id") Integer id
    ){
        return employeeDao.getReferenceById(id);
    }

    //get mapping service for get employee by given Query param id [ /employee/getbyid?id=1]
    @GetMapping(value = "/getbyid" ,params = {"id"},produces = "application/json")
    public Employee getEmployeeByQPId(
            @RequestParam("id") Integer id
    ){
        return employeeDao.getReferenceById(id);
    }

    // create get mpping for get all employee data --> [/employee/findall]
    @GetMapping(value = "/findall" , produces = "application/json")
    // create function for get all employee data
    public List<Employee> findAll(){
            //
       // return employeeDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
        return employeeDao.findAll();
    }

    //create post mapping function for add empoyee [/employee - POST]
    @PostMapping
    public String addEmployee(@RequestBody Employee employee){
        // need to Check privilege for logged user

        
        // need to check duplicate columns values
        // check nic exist or not
        Employee extEmpByNic = employeeDao.getByNic(employee.getNic());
        if(extEmpByNic != null){
            return "Employee insert not completed : Nic already Exist";
        }
        // check email exist or not
        Employee extEmpByEmail = employeeDao.findEmployeeByEmail(employee.getEmail());
        if(extEmpByEmail != null){
            return "Employee insert not completed : email already Exist";
        }

        try {
            //set auto inser value
            //employee.setNumber("00004");
            employee.setNumber(employeeDao.nextEmployeeNumer());
            employee.setAdded_datetime(LocalDateTime.now());

            // save operator
            employeeDao.save(employee);

            //Need update dependency module

            return "0";
        }catch (Exception ex){
            return "Employee insert not completed : " + ex.getMessage();
        }


    }

    //create mapping for  update employee [ /employee - put]
    @PutMapping
    public String updateEmployee(@RequestBody Employee employee){
        //i.	Check privilege for logged user

        // need to check duplicate columns values
        // check nic exist or not
        Employee extEmpByNic = employeeDao.getByNic(employee.getNic());
        if(extEmpByNic != null && employee.getId() != extEmpByNic.getId()){
            return "Employee update not completed : Nic already Exist";
        }
        // check email exist or not
        Employee extEmpByEmail = employeeDao.findEmployeeByEmail(employee.getEmail());
        if(extEmpByEmail != null && employee.getId() != extEmpByEmail.getId()){
            return "Employee update not completed : email already Exist";
        }
        try {
            //set auto inser value
            employee.setLast_update_datetime(LocalDateTime.now());

            // save operator
            employeeDao.save(employee);
            //Need update dependency module
            return "0";
        }catch (Exception ex){
            return "Employee update not completed : " + ex.getMessage();
        }

    }

    // create delete mapping for delete employee [/employee]
    @DeleteMapping
    public String deleteEmployee(@RequestBody Employee employee){
        //need to check privilage

        //check employee exsit
        Employee extEmp = employeeDao.getReferenceById(employee.getId());

        if(extEmp != null){
            try {

                //set auto insert values
                extEmp.setDelete_date_time(LocalDateTime.now());
                extEmp.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));

                employeeDao.save(extEmp);

                //need to update avaible depenence

                return "0";

            }catch (Exception ex){
                return "Delete Not Completd : " + ex.getMessage();
            }
        }else {
            return "Delete Not Completed : Emplyoyee Not Avalable";
        }

    }


}
