package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.PorderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface POrderStatusRepository extends JpaRepository<PorderStatus, Integer> {
}
