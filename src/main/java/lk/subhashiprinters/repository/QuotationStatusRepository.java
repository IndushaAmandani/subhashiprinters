package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.QuotationRequestStatus;
import lk.subhashiprinters.entity.QuotationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuotationStatusRepository extends JpaRepository<QuotationStatus, Integer> {
}
