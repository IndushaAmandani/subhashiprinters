package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.PaperTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.entity.MaterialUnitType;

import java.util.List;

@Repository
public interface MaterialUnitTypeRepository extends JpaRepository<MaterialUnitType,Integer>{


@Query("select new MaterialUnitType(mut.id,mut.name) from MaterialUnitType mut where mut.material_category_id.id=?1")
    List<MaterialUnitType> getByMCategory(Integer mCid);




}
