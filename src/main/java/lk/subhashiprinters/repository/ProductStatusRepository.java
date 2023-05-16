package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import lk.subhashiprinters.entity.ProductStatus;


public  interface ProductStatusRepository extends JpaRepository<ProductStatus,Integer> {
    

    
}
