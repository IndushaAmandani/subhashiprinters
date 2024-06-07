package lk.subhashiprinters.purchaseorder;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

    @Query("select new PurchaseOrder(po.id, po.order_no, po.required_date,po.total_amount,po.quatation_id,po.purchase_order_status_id) from PurchaseOrder po order by po.id desc ")
    List<PurchaseOrder> findAll();

    @Query(value = "SELECT concat('PO',lpad(substring(max(po.order_no),3)+1,5,'0')) FROM subhashiprinters.purchase_order as po;",nativeQuery = true)
    String getNextPorderNo();


    @Query(value = "select new PurchaseOrder (po.id,po.order_no,po.supplier_id,po.quatation_id) from PurchaseOrder po where po.purchase_order_status_id.id=2 and po.supplier_id.id=?1")
    List<PurchaseOrder> getPorderbySupplier(Integer id);

@Query(value = "select new PurchaseOrder(po.id,po.order_no,po.supplier_id,po.quatation_id) from PurchaseOrder po where po.purchase_order_status_id.id=2")
List<PurchaseOrder> list();




@Query(value = "select new PurchaseOrder(po.id,po.order_no,po.supplier_id,po.quatation_id) from PurchaseOrder po where po.supplier_id.id =?1  and ?2 between po.required_date and dateadd(po.required_date,+7, ?2)  and po.purchase_order_status_id.id=2")
    List<PurchaseOrder> getValidPobySupplierRecieveDate(Integer sid, LocalDate parse);

}
