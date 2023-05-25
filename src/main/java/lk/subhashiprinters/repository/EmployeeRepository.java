package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    //Query for get employee by given nic
    @Query("select e from Employee e where e.nic = ?1")
    Employee getByNic(String nic); // mapping function for above query

    //find employee by given email
    Employee findEmployeeByEmail(String email);


    @Query(value = "SELECT lpad(max(e.number)+1,5,'0') FROM subhashiprinters.employee as e;" ,nativeQuery = true)
    String nextEmployeeNumer();

    @Query(value = "select new Employee(e.id,e.calling_name,e.number,e.fullname, e.nic, e.mobile, e.email,e.employeestatus_id) from Employee e order by e.id desc ")
    List<Employee> findAll();


    // query for get employee list  whithout having user account
    //select e from Employee ---> gives objects so use constructor                                                      u.employee_id ---> employee object 
    @Query(value = "select new Employee(e.id, e.calling_name, e.number, e.email) from Employee e where e.id not in(select u.employee_id.id from User u where u.employee_id is NOT NUll)")
    List<Employee> getEmployeeListWithoutUserAccount();
    
}