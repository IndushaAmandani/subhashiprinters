package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.CustomerPaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CPStatusRepository extends JpaRepository<CustomerPaymentStatus, Integer> {
}
