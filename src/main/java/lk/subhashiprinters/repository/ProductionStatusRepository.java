package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.MaterialStatus;
import lk.subhashiprinters.entity.ProductionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionStatusRepository extends JpaRepository <ProductionStatus,Integer>{
    

}
