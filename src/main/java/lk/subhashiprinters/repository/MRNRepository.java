package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.MRN;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MRNRepository extends JpaRepository<MRN, Integer> {

    @Query("select new MRN (mrn.id, mrn.recieve_no, mrn.supplier_inovice_no, mrn.recieve_date, mrn.net_amount, mrn.purchase_order_id, mrn.material_recieve_note_status_id) from MRN mrn order by mrn.id desc ")
    List<MRN> findAll();

    @Query(value = "SELECT concat('PO',lpad(substring(max(po.order_no),3)+1,5,'0')) FROM subhashiprinters.purchase_order as po;",nativeQuery = true)
    String getNextPorderNo();
}
