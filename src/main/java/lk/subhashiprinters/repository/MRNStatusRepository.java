package lk.subhashiprinters.repository;


import lk.subhashiprinters.entity.MRNStatus;
import lk.subhashiprinters.entity.PorderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MRNStatusRepository extends JpaRepository<MRNStatus, Integer> {
}
