package lk.subhashiprinters.supplier;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier,Integer> {

//    @Query("select new Supplier(s.id, s.reg_no, s.company_name,s.company_email,s.company_contact_no, s.supplier_status_id) from Supplier s order by s.id desc ")
//    List<Supplier> findAll();


    @Query("select s from Supplier s where s.company_email=?1")
    Supplier findSupplierByEmail(String email);

    //00001
  //  SELECT lpad(max(c.customercode)+1,5,'0')
  //SUP0000003
    @Query(value = "SELECT concat('SUP',lpad(max(substring(s.reg_no),4)+1 , 7 ,'0')) FROM subhashiprinters.supplier as s;",nativeQuery = true)
    String getNextSupplierRegNo();

    @Query("select  new Supplier(s.id, s.reg_no, s.company_name,s.amount) from Supplier s where s.supplier_status_id.id=1 order by s.id desc")
    List<Supplier> list();


    

    @Query("select  new Supplier(s.id, s.reg_no, s.company_name,s.amount) from Supplier s where s.supplier_status_id.id=1 and " +
            "s.id in (select po.supplier_id.id from PurchaseOrder po where po.id in (select mrn.purchase_order_id.id from MRN mrn where mrn.material_recieve_note_status_id.id=1 or mrn.material_recieve_note_status_id.id=2))")
    List<Supplier> toBePaidList();


}
