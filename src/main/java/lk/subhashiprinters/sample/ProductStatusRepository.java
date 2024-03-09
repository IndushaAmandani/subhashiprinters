package lk.subhashiprinters.sample;

import lk.subhashiprinters.sample.ProductCategoryController;
import org.springframework.data.jpa.repository.JpaRepository;


import org.springframework.stereotype.Repository;

@Repository
public  interface ProductStatusRepository extends JpaRepository<ProductCategoryController.ProductStatus,Integer> {
    

    
}
