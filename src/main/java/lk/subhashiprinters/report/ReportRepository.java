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


// @Query("select new Product (p.id, p.product_code, p.p_name,p.price) from Product p where p.product_status_id.id=1 and p.id in(select co.product_id.id from CustomerOrderHasProduct co where co.customer_order_id.id=?1)")
//@Query("select cohp from CustomerOrderHasProduct cohp where cohp.customer_order_id.id=?1 and cohp.product_id.id=?2")
//@Query("select year(co.added_date),month(co.added_date),count(co.id) from  CustomerOrder co where co.id in (select cohp.customer_order_id.id,cohp.order_qty from CustomerOrderHasProduct cohp where co.customer_order_id.id))   where c.added_date between ?1 and ?2 " +
//        "group by month(c.added_date);")
//String[][] getCOrderbySDateEDate(String sdate,String edate);

//Supplier

      @Query(value = "select year(s.added_date),month(s.added_date),count(s.supplier_id),sum(s.paid_amount) from " +
              "subhashiprinters.supplier_payment as s where s.added_date between ?1 and ?2 " +
              "group by month(s.added_date);",nativeQuery = true)
      String[][] getSPaymentReportMonthly(String sdate,String edate);

      @Query(value = "select year(s.added_date),date(s.added_date),count(s.supplier_id),sum(s.paid_amount) from " +
              "subhashiprinters.supplier_payment as s where s.added_date between ?1 and ?2 " +
              "group by date(s.added_date);",nativeQuery = true)
      String[][] getSPaymentReportDaily(String sdate,String edate);

      @Query(value = "select year(s.added_date),weekofyear(s.added_date),count(s.supplier_id),sum(s.paid_amount) from " +
              "subhashiprinters.supplier_payment as s where s.added_date between ?1 and ?2 " +
              "group by week(s.added_date);",nativeQuery = true)
      String[][] getSPaymentReportWeekly(String sdate,String edate);


      @Query(value = "select year(s.added_date),s.description,count(s.supplier_id),sum(s.paid_amount) from " +
              "subhashiprinters.supplier_payment as c where c.added_date between ?1 and ?2 " +
              "group by year(c.added_date);",nativeQuery = true)
      String[][] getSPaymentReportAnnualy(String sdate,String edate);





}