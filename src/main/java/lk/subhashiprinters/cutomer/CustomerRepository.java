package lk.subhashiprinters.cutomer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerRepository extends JpaRepository<Customer,Integer> {

   @Query(value = "select new Customer(c.id,c.customer_code,c.customer_name,c.mobile,c.customer_email,c.customerstatus_id,c.customer_category_id,c.contactp_name,c.contactp_mobile) from Customer c order by c.id desc")
    List<Customer> findAll();
//,c.customer_type_id
        //Query for get employee by given nic
        @Query("select c from Customer c where c.mobile = ?1")
        Customer getByMobile(String mobile); // mapping function for above query
    
        //find employee by given email
        @Query("select c from Customer c where c.customer_email = ?1")
        Customer findCustomerByEmail(String email);
    
    //00001
        @Query(value = "SELECT concat('CUS',lpad(substring(max(c.customercode),4)+1,6,'0'))  FROM subhashiprinters.customer as c;" ,nativeQuery = true)
        String nextCustomerNumber();

        @Query("select new Customer(c.id, c.customer_name) from Customer c where c.customerstatus_id.id=1 order by c.id DESC ")
       List<Customer> listAll();

        @Query(value = "select new Customer(count(c.id)) from Customer c  where  c.customerstatus_id.id=1")
    Customer activeCustomerCount();

    //get mapping service for get customer by given Query param id [ /employee/getbyid?id=1]
        @Query(value = "select c from Customer c where c.id=?1")
        Customer getReferenceById(Integer id);

}
 