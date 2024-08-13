package lk.subhashiprinters.mrn;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface MRNRepository extends JpaRepository<MRN, Integer> {

    //Integer id,String recieve_no,LocalDate recieve_date,BigDecimal net_amount,PurchaseOrder purchase_order_id, MRNStatus material_recieve_note_status_id,String supplier_inovice_no
//    @Query(value = "select new MRN(mrno.id, mrno.recieve_no, mrno.recieve_date, mrno.net_amount, mrno.purchase_order_id, mrno.material_recieve_note_status_id, mrno.supplier_inovice_no) from MRN mrno order by mrno.id desc")
//    List<MRN> findAll();
//    @Query(value = "SELECT concat('SUP',lpad(substring(max(s.reg_no),4)+1 , 7 ,'0')) FROM subhashiprinters.supplier as s;",nativeQuery = true)
    @Query(value = "SELECT concat('MRN', lpad(max(cast(substring(mrno.recieve_no, 4) as unsigned)) + 1, 6, '0')) " +
            "FROM subhashiprinters.material_recieve_note as mrno;",nativeQuery = true)
    String getNextMRNno();

//    @Query(value = "select concat('M',lpad(max(substring(m.code,2))+1,3,'0')) from subhashiprinters.material as m ;",nativeQuery = true)
//    String nextMaterialNumber();

    @Query(value = "select new MRN(mrno.id,mrno.recieve_no,mrno.recieve_date,mrno.net_amount,mrno.paidamount,mrno.purchase_order_id) from MRN  mrno where mrno.material_recieve_note_status_id.id = 1 or mrno.material_recieve_note_status_id.id=3")
     List <MRN> getnotpaid();

    @Query(value = "select new MRN(mrno.id,mrno.recieve_no,mrno.recieve_date,mrno.net_amount,mrno.paidamount,mrno.purchase_order_id) from  MRN mrno where mrno.material_recieve_note_status_id.id=1 or mrno.material_recieve_note_status_id.id=3 and mrno.purchase_order_id.supplier_id.id=?1 and  mrno.purchase_order_id.supplier_id.supplier_status_id.id=1")
    List <MRN> getSupplierList(Integer supid);



//    @Query("SELECT e FROM Employee e  ORDER BY e.employee_status_id.id desc/asc ")
//  public List<Employee> getAllEmployeesASC(Integer currentUserEmpID);
}
