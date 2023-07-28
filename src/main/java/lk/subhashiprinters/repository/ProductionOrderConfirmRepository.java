package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductionOrderConfirmRepository extends JpaRepository<CustomerOrder,Integer> {

    @Query("select co from CustomerOrder co where co.production_status_id.id=1 order by co.id desc")
    List<CustomerOrder> findbyStatus();
 @Query("select co from CustomerOrder co where co.production_status_id.id=1 and co.id=?1")
 CustomerOrder getReferenceById( Integer id);




}

