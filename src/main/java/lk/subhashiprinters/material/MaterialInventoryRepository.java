package lk.subhashiprinters.material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialInventoryRepository extends JpaRepository<MaterialInventory,Integer> {

    @Query("select matinv from MaterialInventory matinv where matinv.material_id.id=?1")
    MaterialInventory getByMaterial(Integer matid);



//    @Query(value = "select new DailyProduct(dp.id,dp.customer_order_id,dp.product_id,dp.totalqty,dp.completedqty,dp.dailyqty,dp.new_balance_qty)from DailyProduct dp order by dp.id desc")
//    List<MaterialInventory> findAll();
//
    @Query(value = "select minventory from MaterialInventory minventory where minventory.inventorystatus_id.id =1")
    List<MaterialInventory> getAvailbleMaterialQty();

}
