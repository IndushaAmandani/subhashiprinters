package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.CustomerOrder;
import lk.subhashiprinters.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder,Integer> {

    @Query("select new CustomerOrder (co.id,co.order_code,co.total_of_lines,co.discount,co.total_amount,co.advanced_amount,co.paid_amount,co.final_balanced_amount,co.order_status_id) from CustomerOrder co order by co.id desc ")
    List<CustomerOrder> findAll();


    @Query(value = "SELECT concat('CO',lpad(substring(max(co.order_code),3)+1,4,'0')) FROM subhashiprinters.customer_order as co;",nativeQuery = true)
    String getNextPorderNo();

    @Query("select new CustomerOrder (co.id,co.order_code) from CustomerOrder co")
    List<CustomerOrder> list();

    @Query(value = "select new CustomerOrder(count(co.id)) from CustomerOrder co where co.order_status_id.id=1")
    CustomerOrder pendingCustomerOrders();

    @Query(value = "select new CustomerOrder(co.id,co.order_code)from CustomerOrder co where co.order_status_id.id=1 or co.order_status_id.id=2")
            List <CustomerOrder> getNotpaidList();

@Query(value = "select new CustomerOrder(co.id,co.order_code)from CustomerOrder co where co.order_status_id.id=1 or co.order_status_id.id=2 and co.customer_id.id=?1")
    List <CustomerOrder> getNotPaidCustomers(Integer cid);
}

