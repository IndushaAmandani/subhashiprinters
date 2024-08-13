package lk.subhashiprinters.corder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerOrderHasMaterialRepository extends JpaRepository<CustomerOrderHasMaterial,Integer> {
//
//    @Query(value = "select cohm from CustomerOrderHasMaterial cohm where cohm.material_id.id=?1")
//    CustomerOrderHasMaterial getmaterialbyid()
}
