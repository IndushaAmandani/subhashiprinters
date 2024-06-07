package lk.subhashiprinters.purchaseorder;

import lk.subhashiprinters.purchaseorder.PurchaseOrderHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface PurchaseOrderHasMaterialRepository extends JpaRepository<PurchaseOrderHasMaterial, Integer> {

    //Integer id,BigDecimal purchase_price,Integer quantity,BigDecimal line_total
    @Query("select pm from PurchaseOrderHasMaterial pm where pm.purchase_order_id.id=?1 and  pm.material_id.id=?2")
    PurchaseOrderHasMaterial getMbyPOrder(Integer poid,Integer mid);
}
