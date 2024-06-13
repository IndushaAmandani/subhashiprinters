package lk.subhashiprinters.supplierpayment;


import lk.subhashiprinters.supplierpayment.SupplierPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierPaymentRepository extends JpaRepository<SupplierPayment, Integer> {

    @Query("select new SupplierPayment(sp.id,sp.bill_no,sp.total_amount,sp.paid_amount,sp.balance_amount,sp.supplier_id,sp.material_recieve_note_id,sp.supplier_payment_type_id,sp.supplier_payment_status_id) from SupplierPayment sp order by sp.id desc ")
    List<SupplierPayment> findAll();

    @Query(value = "SELECT concat('SP',lpad(substring(max(sp.bill_no),3)+1,5,'0')) FROM subhashiprinters.supplier_payment as sp;",nativeQuery = true)
    String getNextSupplierPaymentID();
}
