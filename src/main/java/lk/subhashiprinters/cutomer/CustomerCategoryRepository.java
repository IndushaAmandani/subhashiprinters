package lk.subhashiprinters.cutomer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerCategoryRepository extends JpaRepository<CustomerCategory,Integer>{
    
}
