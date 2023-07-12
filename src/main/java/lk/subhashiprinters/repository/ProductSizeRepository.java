package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.entity.ProductSize;

import java.util.List;

@Repository
public interface ProductSizeRepository extends JpaRepository<ProductSize,Integer>{

    @Query(value = "select new ProductSize (pz.id,pz.name) from ProductSize pz where pz.product_category_id.id =?1")
     List<ProductSize> getByPCategory( Integer pcid);


}


