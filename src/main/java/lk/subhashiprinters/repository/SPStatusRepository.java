package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.SupplierPaymentStatus;
import lk.subhashiprinters.entity.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SPStatusRepository extends JpaRepository<SupplierPaymentStatus, Integer> {
}
