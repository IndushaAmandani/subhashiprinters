package lk.subhashiprinters.corder;


import lk.subhashiprinters.corder.CustomerOrder;
import lk.subhashiprinters.cutomer.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {

//    @Query("select new CustomerOrder (co.id,co.order_code,co.required_date,co.total_of_lines,co.discount,co.total_amount,co.advanced_amount,co.order_balance,co.final_balanced_amount,co.production_status_id,co.order_status_id) from CustomerOrder co order by co.id desc ")
//    List<CustomerOrder> findAll();


    @Query(value = "SELECT concat('CO',lpad(substring(max(co.order_code),3)+1,4,'0')) FROM subhashiprinters.customer_order as co;", nativeQuery = true)
    String getNextPorderNo();

    @Query("select new CustomerOrder (co.id,co.order_code,co.final_balanced_amount,co.total_amount,co.order_balance) from CustomerOrder co where co.order_status_id.id <>3")
    List<CustomerOrder> list();

    @Query(value = "select c from CustomerOrder c where c.id=?1")
    CustomerOrder getReferenceById(Integer id);

    @Query(value = "select new CustomerOrder(count(co.id)) from CustomerOrder co where co.order_status_id.id=1")
    CustomerOrder pendingCustomerOrders();

    @Query(value = "select new CustomerOrder(co.id,co.order_code,co.final_balanced_amount,co.total_amount,co.order_balance)from CustomerOrder co where co.order_status_id.id=1 or co.order_status_id.id=2")
    List<CustomerOrder> getNotpaidList();

    @Query(value = "select new CustomerOrder(co.id,co.order_code,co.final_balanced_amount,co.total_amount,co.order_balance)from CustomerOrder co where co.customer_id.id=?1 and co.order_balance<>0 and co.order_status_id.id<>6")
    List<CustomerOrder> getNotPaidCustomers(Integer cid);


    @Query(value = "select co from CustomerOrder co where co.id=?1 and co.production_status_id.id=2")
    CustomerOrder getByProductionStatus(Integer id);


    @Query(value = "select co from CustomerOrder co where co.order_status_id.id<>6 and  co.order_status_id.id<>5 and  co.order_status_id.id<>4 and co.required_date between ?1 and ?2  ")
    List<CustomerOrder> getUrgentOrders(LocalDate sdate, LocalDate edate);


    @Query(value = "select co from CustomerOrder co where co.order_status_id.id<>6 and co.order_status_id.id<>5 and co.customer_id.id=?1")
    List<CustomerOrder> getCustomerbyCOStatus(Integer cid);
}

