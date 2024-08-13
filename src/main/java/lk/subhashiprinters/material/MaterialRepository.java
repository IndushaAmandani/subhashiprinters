package lk.subhashiprinters.material;

 import java.math.BigDecimal;
 import java.util.List;

 import org.springframework.data.jpa.repository.JpaRepository;
 import org.springframework.data.jpa.repository.Query;

 import lk.subhashiprinters.material.Material;

 public interface MaterialRepository extends JpaRepository<Material,Integer> {

     @Query(value = "select new Material(m.id, m.name, m.code,m.material_category_id,m.width,m.height,m.material_status_id,m.material_unit_type_id) from Material m order by m.id desc")
     List<Material> getallmaterialset();


//     @Query("select new Material (m.id, m.name, m.code,m.measuring_count) from Material m where m.material_status_id.id=1")
//     List<Material> list();

     // //Query for get material by given code
     @Query("select m from Material m where m.code =?1")
     Material getByCode(BigDecimal code);

    // //adding next code number
     @Query(value = "select concat('M',lpad(max(substring(m.code,2))+1,3,'0')) from subhashiprinters.material as m ;",nativeQuery = true)
     String nextMaterialNumber();

     // //Query for get material by given name
     @Query("select m from Material m where m.name =?1")
     Material getMaterialByName(String name);
     //reorder_point
     //reorder_quantity

     @Query("select new Material(m.id, m.name, m.code,m.unit_price,m.width,m.height) from Material m where m.material_status_id.id=1 and m.id in " +
             "(select shm.material_id.id from SupplierHasMaterial shm where shm.supplier_id.id=?1) ")
     List<Material> getListBySupplier(Integer sid);

     @Query("select new Material(m.id, m.name, m.code,m.unit_price,m.width,m.height) from Material m where m.material_status_id.id=1 and m.id not in " +
             "(select shm.material_id.id from SupplierHasMaterial shm where shm.supplier_id.id=?1) ")
     List<Material> getNotListBySupplier(Integer sid);

     @Query("select new Material(m.id, m.name, m.code,m.unit_price,m.width,m.height) from Material m where m.material_status_id.id=1 and m.id in " +
             "(select phm.material_id.id from PurchaseOrderHasMaterial phm where phm.purchase_order_id.id=?1) ")
     List<Material> getListByPOrder(Integer poid);

  @Query("select new Material(m.id, m.name, m.code,m.unit_price,m.width,m.height) from Material m where m.material_status_id.id=1 and m.id in " +
          "(select qhm.material_id.id from QuotationHasMaterial qhm where qhm.quatation_id.id=?1) ")
     List<Material> getListByQuotation(Integer qid);

     @Query("select new Material(m.id, m.name, m.code,m.unit_price,m.width,m.height) from Material m where m.material_status_id.id=1")
        List<Material> list();


     @Query("select new Material(m.id, m.name, m.code,m.unit_price,m.width,m.height) from Material m where m.material_status_id.id=1 and m.material_unit_type_id.id=3 and m.material_category_id.id=1")
     List<Material> getMaterialListbyCategory();

     @Query("select new Material(m.id, m.name, m.code,m.unit_price,m.width,m.height) from Material m where m.material_status_id.id=1 and m.paper_ink_type_id.id=?1")
     List<Material> getMaterialListbySubCategory(Integer subid);

     @Query("select new Material(m.id, m.name, m.code,m.unit_price,m.width,m.height) from Material m where m.material_status_id.id=1 and m.paper_ink_type_id.id in (select pithpc.paper_ink_type_id.id from PaperInkTypeHasProductCategory pithpc where pithpc.product_category_id.id=?1)")
     List<Material> getMaterialListbyProductCategory(Integer pcid);
 }
