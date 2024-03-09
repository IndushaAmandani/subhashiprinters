package lk.subhashiprinters.corder;

import lk.subhashiprinters.corder.CustomerOrderHasProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerOrderProductRepository extends JpaRepository<CustomerOrderHasProduct,Integer> {

@Query("select cohp from CustomerOrderHasProduct cohp where cohp.customer_order_id.id=?1 and cohp.product_id.id=?2")
  CustomerOrderHasProduct byCoidPid(Integer coid, Integer pid);
}
