package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.entity.MaterialUnitType;

@Repository
public interface MaterialUnitTypeRepository extends JpaRepository<MaterialUnitType,Integer>{
    
}
