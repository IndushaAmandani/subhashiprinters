package lk.subhashiprinters.cpayment;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerPaymentRepository extends JpaRepository<CustomerPayment, Integer> {

    @Query("select new CustomerPayment(cp.id,cp.customer_payment_bill_number,cp.total_amount,cp.pre_balance_amount,cp.paid_amount,cp.after_balance_amount,cp.customer_id,cp.customer_payment_type_id,cp.customer_payment_status_id) from CustomerPayment cp order by cp.id desc ")
    List<CustomerPayment> findAll();

       @Query(value = "SELECT concat('CP',lpad(substring(max(cp.customer_payment_bill_number),3)+1 , 4 ,'0')) FROM subhashiprinters.customer_payment as cp;",nativeQuery = true)
   String getNextCustomerPaymentBillNo();


//        @Query(value = "select new CustomerPayment(cp.id,cp.customer_payment_bill_number) from CustomerPayment cp where cp.customer_payment_status_id.id=2")
//  List <CustomerPayment> getCustomerPaymentBy();

}
