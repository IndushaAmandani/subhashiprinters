package lk.subhashiprinters.quotation;


import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Integer> {

//    @Query("select new Quotation(q.id, q.number, q.recieve_date,q.valid_period,q.quatation_request_id,q.quatation_status_id) from Quotation q order by q.id desc ")
//    List<Quotation> findAll();

    @Query(value = "SELECT concat('Q',lpad(substring(max(q.number),2)+1,5,'0')) FROM subhashiprinters.quatation as q;",nativeQuery = true)
    String getNextQNo();

    @Query("select new Quotation(q.id, q.number) from Quotation q where q.quatation_status_id.id=1")
    List<Quotation> listAll();

    @Query("select new Quotation(q.id, q.number) from Quotation q where q.quatation_request_id.supplier_id.id=?1 and " +
            "?2 between q.recieve_date and q.valid_period and  q.quatation_status_id.id=1")
    List<Quotation> validList(Integer sid, LocalDate rdate);



}
