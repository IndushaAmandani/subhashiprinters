package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.QuotationRequestStatus;
import lk.subhashiprinters.entity.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuotationRequestStatusRepository extends JpaRepository<QuotationRequestStatus, Integer> {
}
