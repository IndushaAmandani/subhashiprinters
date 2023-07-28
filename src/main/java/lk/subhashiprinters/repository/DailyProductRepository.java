package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.DailyProduct;
import lk.subhashiprinters.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyProductRepository extends JpaRepository<DailyProduct,Integer> {

    @Query(value = "select new DailyProduct(dp.id,dp.customer_order_id,dp.product_id,dp.totalqty,dp.completedqty,dp.dailyqty,dp.new_balance_qty)from DailyProduct dp order by dp.id desc")
    List<DailyProduct> findAll();

    @Query(value = "select new DailyProduct(dp.id,dp.completedqty,dp.completedqty)from DailyProduct dp where dp.product_id.id=?1")
    List<DailyProduct>getBypid(Integer pid);

}
