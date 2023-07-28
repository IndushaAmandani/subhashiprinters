package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.CustomerPaymentStatus;
import lk.subhashiprinters.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<Module, Integer> {
}
