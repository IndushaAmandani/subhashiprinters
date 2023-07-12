package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.COrderStatus;
import lk.subhashiprinters.entity.CustomerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface COrderStatusRepository extends JpaRepository<COrderStatus,Integer> {
    


    
}
