package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Employee, Integer> {

@Query(value = "select count(c.id),sum(c.paid_amount),year(c.added_date),month(c.added_date) from " +
        "subhashiprinters.customer_payment as c where c.added_date between ?1 and ?2 " +
        "group by month(c.added_date);",nativeQuery = true)
      List getPaymentReport(String sdate,String edate);
    
}