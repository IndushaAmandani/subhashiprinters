package lk.subhashiprinters.sample;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.sample.Product;
@Repository
public interface ProductRepository extends JpaRepository<Product,Integer>{
    
//@Query(value = "select new Product(p.id,p.product_code,p.p_name,p.price,p.single_or_double,p.product_status_id,p.customer_id,p.product_category_id,p.product_size_id) from Product p order by p.id desc")
// List<Product> findAll();

 //Query for next product code
 @Query(value = "SELECT lpad(max(p.product_code)+1,8,'0') FROM subhashiprinters.product as p;" ,nativeQuery = true)
 String nextProductCodeNumber();


//
//
 @Query("select new Product(p.id, p.product_code, p.p_name,p.price) from Product p where p.product_status_id.id=1  and p.customer_id.id=?1")
 List<Product> getListByCustomer(Integer cid);


 @Query("select new Product (p.id, p.product_code, p.p_name,p.price) from Product p where p.product_status_id.id=1 and p.id in(select co.product_id.id from CustomerOrderHasProduct co where co.customer_order_id.id=?1)")
 List<Product> getListByCOrder(Integer coid);

 @Query("select new Product (p.id,p.product_code,p.p_name,p.price) from Product p where p.product_status_id.id=1")
 List<Product> list();

//@Query("select new Product (p.id,p.product_code,p.p_name,p.price) from Product p where p.id=?1 in "+
//        "(select cohp.product_id.id from CustomerOrderHasProduct cohp where cohp.customer_order_id.id in "
//+"(select c.id from CustomerOrder c where c.order_status_id<>5 and c.order_status_id.id<>6))")
//Product getProductbyCOStatus(Integer pid);
// //get product

 //SELECT p.* FROM subhashiprinters.product as p where p.id not in (SELECT cohp.product_id FROM subhashiprinters.customer_order_has_product as cohp where cohp.customer_order_id not in (SELECT co.id FROM subhashiprinters.customer_order as co where co.order_status_id<>5 and co.order_status_id<>6)) and  p.id=25;
 @Query("select p from Product p where p.id not in (select cohasp.product_id.id from CustomerOrderHasProduct cohasp where cohasp.customer_order_id.id in (select co.id from CustomerOrder co where co.order_status_id.id<>5 and co.order_status_id.id<>6))")
 List <Product> getByProductListOFDeletable();

// @Query(value = "SELECT P FROM Product P where P.id in (SELECT phm.product_id.id FROM ProductHasMaterial phm where phm.material_id.id=?1)")
// public List<Product> getProductListByMaterial(Integer materialId);



 
//name varchar(150) 
// width decimal(5,2) 
// height decimal(5,2) 
// added_date datetime 
// updated_date datetime 
// deleted_date datetime 
// description text 
// image mediumblob 
// price decimal(10,2) 
// single_or_double varchar(10) 
// added_user_id int 
// updated_user_id int 
// deleted_user_id int 
// product_status_id int 
// customer_id int 
// papercolors_id int 
// product_category_id int 
// printcolors_id int 
// papertype_id int 
// product_size_id int 
// number_of_copies

}

