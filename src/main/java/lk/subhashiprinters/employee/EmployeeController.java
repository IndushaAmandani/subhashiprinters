package lk.subhashiprinters.employee;


import lk.subhashiprinters.privilege.PrivilageController;
import lk.subhashiprinters.userm.User;
import lk.subhashiprinters.userm.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
//import  jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
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
    @Autowired
    private PrivilageController privilageController;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserRepository userDao;

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
    public Employee getEmployeeByPVId(@PathVariable("id") Integer id){return employeeDao.getReferenceById(id);}

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
        // need to check privilage
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String,Boolean> userPrvi = privilageController.getPrivilageByUserModule(auth.getName(), "Employee");
       // return employeeDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
        if(loggedUser != null && userPrvi.get("sel")){
            //return userDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
            return employeeDao.findAll();
        }else {
            return null;
        }

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
            String nextEmpNumber = employeeDao.nextEmployeeNumer();
            employee.setNumber(nextEmpNumber);
            employee.setAdded_datetime(LocalDateTime.now());
            // save operator
            employeeDao.save(employee);

            Employee newlySavedEmp = employeeDao.findByNumber(nextEmpNumber);
            User createuseraccount = new User();
            createuseraccount.setEmployee_id(newlySavedEmp);
            createuseraccount.setUsername(newlySavedEmp.getCalling_name()+newlySavedEmp.getNumber());
            createuseraccount.setPassword(bCryptPasswordEncoder.encode(newlySavedEmp.getNic()));
            createuseraccount.setEmail(newlySavedEmp.getEmail());
            createuseraccount.setStatus(true);
            createuseraccount.setUserphoto(newlySavedEmp.getEmp_photo());
            //save neewly created user
            userDao.save(createuseraccount);

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
      Authentication auth =   SecurityContextHolder.getContext().getAuthentication();

        // need to check duplicate columns values
               Employee extEmployee  = employeeDao.getReferenceById(employee.getId());
               if(extEmployee == null){
                   return "Employee update not completed : Employee not availbale";
               }
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
            User extuser =  userDao.getUserByEmplyee(employee.getId());
             if (employee.getEmployeestatus_id().getName().equals("Resign")|| employee.getEmployeestatus_id().getName().equals("Removed")){
               extuser.setStatus(false);
            };
             extuser.setUserphoto(employee.getEmp_photo());
             extuser.setUpdatedatetime(LocalDateTime.now());
             userDao.save(extuser);
            // save operator
            employeeDao.save(employee);
            //Need update dependency module
            return "0";
        }catch (Exception ex){
            return "Employee update not completed : " + ex.getMessage();
        }

    }

    // create delete mapping for delete employee [/employee]
    //@Transactional
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
                //updating user status
                  User extUser = userDao.getUserByEmplyee(extEmp.getId());
                        if(extUser != null){
                            extUser.setStatus(false);
                            userDao.save(extUser);}


                return "0";

            }catch (Exception ex){
                return "Delete Not Completd : " + ex.getMessage();
            }
        }else {
            return "Delete Not Completed : Emplyoyee Not Avalable";
        }

    }


}
