package lk.subhashiprinters.material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialUnitTypeRepository extends JpaRepository<MaterialUnitType,Integer>{
    
 @Query("select mc from MaterialUnitType mc where mc.material_category_id.id=?1")
    List<MaterialUnitType> getUByMCategory(Integer mCid);

}
