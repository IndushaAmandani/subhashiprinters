package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.SupplierPaymentStatus;
import lk.subhashiprinters.entity.SupplierPaymentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SPTypeRepository extends JpaRepository<SupplierPaymentType, Integer> {
}
