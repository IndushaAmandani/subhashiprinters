package lk.subhashiprinters.mrn;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface MRNRepository extends JpaRepository<MRN, Integer> {

    //Integer id,String recieve_no,LocalDate recieve_date,BigDecimal net_amount,PurchaseOrder purchase_order_id, MRNStatus material_recieve_note_status_id,String supplier_inovice_no
    @Query(value = "select new MRN(mrno.id, mrno.recieve_no, mrno.recieve_date, mrno.net_amount, mrno.purchase_order_id, mrno.material_recieve_note_status_id, mrno.supplier_inovice_no) from MRN mrno order by mrno.id desc")
    List<MRN> findAll();

    @Query(value = "SELECT concat('MRN',lpad(substring(max(mrno.recieve_no),3)+1,4,'0')) FROM subhashiprinters.material_recieve_note as mrno;",nativeQuery = true)
    String getNextMRNno();

    @Query(value = "select new MRN(mrno.id,mrno.recieve_no,mrno.recieve_date,mrno.net_amount) from MRN  mrno where mrno.material_recieve_note_status_id.id = 1")
     List <MRN> getnotpaid();





}
