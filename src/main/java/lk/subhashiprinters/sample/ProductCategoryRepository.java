package lk.subhashiprinters.sample;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.subhashiprinters.sample.ProductCategory;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory,Integer> {


    @Query(value = "select pc from ProductCategory pc order by pc.id desc")
    List<ProductCategory> findAll();



    @Query(value = "select pcid from ProductCategory pcid where pcid.name=?1")
   ProductCategory getPCategorybyName(String pcname);

}
