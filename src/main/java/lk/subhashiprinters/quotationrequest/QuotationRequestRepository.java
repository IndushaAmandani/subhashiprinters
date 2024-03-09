package lk.subhashiprinters.quotationrequest;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuotationRequestRepository extends JpaRepository<QuotationRequest,Integer> {

    @Query("select new QuotationRequest(qr.id, qr.request_number, qr.required_date,qr.supplier_id,qr.quatation_req_status_id) from QuotationRequest qr order by qr.id desc ")
    List<QuotationRequest> findAll();


    @Query("select qr from QuotationRequest qr where qr.request_number=?1")
    QuotationRequest findQuotationRequestByQrno(String qrno);

    @Query(value = "SELECT concat('QR',lpad(substring(max(qr.request_number),3)+1 , 5 ,'0')) FROM subhashiprinters.quatation_request as qr;",nativeQuery = true)
    String getNextQuotationrequestRegNo();

    @Query("select new QuotationRequest(qr.id, qr.request_number,qr.supplier_id) from QuotationRequest qr where qr.supplier_id.id=?1 and qr.quatation_req_status_id.id=1")
    List<QuotationRequest> getListBySupplier(Integer sid);

    @Query("select new QuotationRequest(qr.id, qr.request_number,qr.supplier_id) from QuotationRequest qr")
    List<QuotationRequest> list();
}
