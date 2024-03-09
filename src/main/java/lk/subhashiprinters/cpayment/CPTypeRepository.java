package lk.subhashiprinters.cpayment;


import org.springframework.data.jpa.repository.JpaRepository;

public interface CPTypeRepository extends JpaRepository<CustomerPaymentType, Integer> {
}
