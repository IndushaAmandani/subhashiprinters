package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.PurchaseOrderHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PurchaseOrderHasMaterialRepository extends JpaRepository<PurchaseOrderHasMaterial, Integer> {
}
