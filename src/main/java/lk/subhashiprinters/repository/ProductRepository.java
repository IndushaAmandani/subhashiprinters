package lk.subhashiprinters.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.entity.Product;
@Repository
public interface ProductRepository extends JpaRepository<Product,Integer>{
    
@Query(value = "select new Product(p.id,p.product_code,p.p_name,p.price,p.single_or_double,p.product_status_id,p.customer_id,p.papercolors_id,p.product_category_id,p.printcolors_id,p.product_size_id) from Product p order by p.id desc")
 List<Product> findAll();

 //Query for next product code
 @Query(value = "SELECT lpad(max(p.product_code)+1,10,'0') FROM subhashiprinters.product as p;" ,nativeQuery = true)
 String nextProductCodeNumber();


//
//
 @Query("select new Product (p.id, p.product_code, p.p_name,p.price) from Product p where p.product_status_id.id=1  and p.customer_id.id=?1")
 List<Product> getListByCustomer(Integer cid);


 @Query("select new Product (p.id, p.product_code, p.p_name,p.price) from Product p where p.product_status_id.id=1 and p.id in(select co.product_id.id from CustomerOrderHasProduct co where co.customer_order_id.id=?1)")
 List<Product> getListByCOrder(Integer coid);

 @Query("select new Product (p.id,p.product_code,p.p_name,p.price) from Product p where p.product_status_id.id=3")
 List<Product> list();



// //get product
// @Query("select p from Product p where p.product_code = ?1")
// Product getByProductCode(String  product_code);



 
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

