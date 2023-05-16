package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.Employeestatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeStatusRepository extends JpaRepository<Employeestatus,Integer> {
}
