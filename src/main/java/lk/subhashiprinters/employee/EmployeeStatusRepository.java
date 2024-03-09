package lk.subhashiprinters.employee;

import lk.subhashiprinters.employee.Employeestatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeStatusRepository extends JpaRepository<Employeestatus,Integer> {
}
