package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.entity.ProductSize;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize,Integer>{

    
}
