package lk.subhashiprinters.corder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionStatusRepository extends JpaRepository <ProductionStatus,Integer>{
    

}
