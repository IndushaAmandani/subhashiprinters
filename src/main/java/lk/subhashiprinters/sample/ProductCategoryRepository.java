package lk.subhashiprinters.sample;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.subhashiprinters.sample.ProductCategory;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory,Integer> {



}
