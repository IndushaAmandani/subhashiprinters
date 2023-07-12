package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.Customer;
import lk.subhashiprinters.entity.CustomerPaymentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CPTypeRepository extends JpaRepository<CustomerPaymentType, Integer> {
}
