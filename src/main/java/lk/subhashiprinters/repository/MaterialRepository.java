// package lk.subhashiprinters.repository;

// import java.math.BigDecimal;
// import java.util.List;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;

// import lk.subhashiprinters.entity.Material;

// public interface MaterialRepository extends JpaRepository<Material,Integer> {

//     @Query(value = "select new Material(m.id,m.code,m.measuring_count,m.material_category_id,m.materal_unit_type_id,m.material_status_id) from Material m order by m.id desc")
//     List<Material> findAll();

    // //Query for get material by given nic
    // @Query("select m from Material where m.code = ?1")
    // Material getByCode(BigDecimal code);

    // //adding next code number
    // @Query(value = "select lpad(max(m.number)+1,10,'0') from subhashiprinters.material as m ;",nativeQuery = true)
    // String nextMaterialNumber();


//}
