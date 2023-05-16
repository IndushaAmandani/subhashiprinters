package lk.subhashiprinters.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.subhashiprinters.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer,Integer> {

   @Query(value = "select new Customer(c.id,c.customer_code,c.customer_name,c.mobile,c.customer_email,c.customerstatus_id,c.customer_type_id,c.customer_category_id) from Customer c order by c.id desc")
    List<Customer> findAll();

        //Query for get employee by given nic
        @Query("select c from Customer c where c.mobile = ?1")
        Customer getByMobile(String mobile); // mapping function for above query
    
        //find employee by given email
        @Query("select c from Customer c where c.customer_email = ?1")
        Customer findCustomerByEmail(String email);
    
    
        @Query(value = "SELECT lpad(max(c.customercode)+1,5,'0') FROM subhashiprinters.customer as c;" ,nativeQuery = true)
        String nextCustomerNumber();
    
}
 