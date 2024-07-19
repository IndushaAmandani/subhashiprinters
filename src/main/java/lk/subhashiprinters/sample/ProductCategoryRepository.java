package lk.subhashiprinters.sample;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.subhashiprinters.sample.ProductCategory;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory,Integer> {


    @Query(value = "select new ProductCategory(pc.id,pc.name,pc.profit_rate,pc.production_cost) from ProductCategory pc order by pc.id desc")
    List<ProductCategory> findAll();


    @Query(value = "select pcid from ProductCategory pcid where pcid.id=?1")
   ProductCategory getPCategorybyid(Integer pcid);

}
