package lk.subhashiprinters.purchaseorder;


import lk.subhashiprinters.purchaseorder.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

    @Query("select new PurchaseOrder(po.id, po.order_no, po.required_date,po.total_amount,po.quatation_id,po.purchase_order_status_id) from PurchaseOrder po order by po.id desc ")
    List<PurchaseOrder> findAll();

    @Query(value = "SELECT concat('PO',lpad(substring(max(po.order_no),3)+1,5,'0')) FROM subhashiprinters.purchase_order as po;",nativeQuery = true)
    String getNextPorderNo();


    @Query(value = "select new PurchaseOrder (po.id,po.supplier_id,po.quatation_id) from PurchaseOrder po where po.purchase_order_status_id.id=2 and po.supplier_id.id=?1")
    List<PurchaseOrder> getPorderbySupplier(Integer id);
}
