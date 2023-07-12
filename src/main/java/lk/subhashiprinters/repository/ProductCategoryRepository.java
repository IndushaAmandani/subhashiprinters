package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.subhashiprinters.entity.ProductCategory;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory,Integer> {



}
