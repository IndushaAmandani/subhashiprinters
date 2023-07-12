package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import lk.subhashiprinters.entity.ProductStatus;
import org.springframework.stereotype.Repository;

@Repository
public  interface ProductStatusRepository extends JpaRepository<ProductStatus,Integer> {
    

    
}
