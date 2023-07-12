package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

    @Query("select new PurchaseOrder(po.id, po.order_no, po.required_date,po.total_amount,po.quatation_id,po.purchase_order_status_id) from PurchaseOrder po order by po.id desc ")
    List<PurchaseOrder> findAll();

    @Query(value = "SELECT concat('PO',lpad(substring(max(po.order_no),3)+1,5,'0')) FROM subhashiprinters.purchase_order as po;",nativeQuery = true)
    String getNextPorderNo();
}