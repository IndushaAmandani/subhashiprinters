package lk.subhashiprinters.purchaseorder;

import lk.subhashiprinters.purchaseorder.PurchaseOrderHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PurchaseOrderHasMaterialRepository extends JpaRepository<PurchaseOrderHasMaterial, Integer> {
}
