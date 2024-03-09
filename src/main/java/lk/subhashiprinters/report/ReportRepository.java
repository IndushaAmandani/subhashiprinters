package lk.subhashiprinters.report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.employee.Employee;

@Repository
public interface ReportRepository extends JpaRepository<Employee, Integer> {

@Query(value = "select year(c.added_date),month(c.added_date),count(c.id),sum(c.paid_amount) from " +
        "subhashiprinters.customer_payment as c where c.added_date between ?1 and ?2 " +
        "group by month(c.added_date);",nativeQuery = true)
      String[][] getPaymentReportMonthly(String sdate,String edate);
@Query(value = "select year(c.added_date),date(c.added_date),count(c.id),sum(c.paid_amount) from " +
        "subhashiprinters.customer_payment as c where c.added_date between ?1 and ?2 " +
        "group by date(c.added_date);",nativeQuery = true)
      String[][] getPaymentReportDaily(String sdate,String edate);
@Query(value = "select year(c.added_date),weekofyear(c.added_date),count(c.id),sum(c.paid_amount) from " +
        "subhashiprinters.customer_payment as c where c.added_date between ?1 and ?2 " +
        "group by week(c.added_date);",nativeQuery = true)
      String[][] getPaymentReportWeekly(String sdate,String edate);
@Query(value = "select year(c.added_date),c.description,count(c.id),sum(c.paid_amount) from " +
        "subhashiprinters.customer_payment as c where c.added_date between ?1 and ?2 " +
        "group by year(c.added_date);",nativeQuery = true)
      String[][] getPaymentReportAnnualy(String sdate,String edate);

    
}