package lk.subhashiprinters.purchaseorder;


import org.springframework.data.jpa.repository.JpaRepository;

public interface POrderStatusRepository extends JpaRepository<PorderStatus, Integer> {
}
