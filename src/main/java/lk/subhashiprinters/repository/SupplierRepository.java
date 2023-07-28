package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier,Integer> {

    @Query("select new Supplier(s.id, s.reg_no, s.company_name,s.company_email,s.company_contact_no, s.supplier_status_id) from Supplier s order by s.id desc ")
    List<Supplier> findAll();


    @Query("select s from Supplier s where s.company_email=?1")
    Supplier findSupplierByEmail(String email);

    @Query(value = "SELECT concat('SUP',lpad(substring(max(s.reg_no),4)+1 , 7 ,'0')) FROM subhashiprinters.supplier as s;",nativeQuery = true)
    String getNextSupplierRegNo();

    @Query("select  new Supplier(s.id, s.reg_no, s.company_name,s.amount) from Supplier s where s.supplier_status_id.id=1")
    List<Supplier> list();
}
