package lk.subhashiprinters.cpayment;


import org.springframework.data.jpa.repository.JpaRepository;

public interface CPStatusRepository extends JpaRepository<CustomerPaymentStatus, Integer> {
}
