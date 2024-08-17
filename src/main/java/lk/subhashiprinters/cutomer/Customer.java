package lk.subhashiprinters.cutomer;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lk.subhashiprinters.userm.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert class into persistenet entity
@Table(name = "customer") // Mapping table name
@Data // for create setter and getter to string ..etc
@NoArgsConstructor
@AllArgsConstructor

public class Customer {

  @Id //mapping to the id as primary key
  @GeneratedValue(strategy = GenerationType.IDENTITY) // As Id is autoincremented
  //mapping to the column
  @Column(name = "id")
  private Integer id;

  //mapping to the column
  @Column(name = "customercode")
  private String customer_code;
  //mapping to the column
  @Column(name = "customer_name")
  private String customer_name;
  //mapping to the column
  @Column(name = "mobile")
  private String mobile;

  @Column(name = "email")
  private String customer_email;

  @Column(name = "company_name")
  private String company_name;

  @Column(name = "company_email")
  private String company_email;

  @Column(name = "company_contactnumber")
  private String company_contactnumber;

  @Column(name = "added_date")
  private LocalDateTime added_date;

  @Column(name = "updated_date")
  private LocalDateTime updated_date;

  @Column(name = "deleted_date")
  private LocalDateTime delete_date;

  @Column(name = "description")
  private String description;

  @Column(name = "contactp_name")
  private String contactp_name;
// contactp_name
//contactp_mobile
    //mapping to the column
  @Column(name = "contactp_mobile")
  private String contactp_mobile;

  @Column(name = "contactp_email")
  private String contactp_email;

  @ManyToOne
  @JoinColumn(name = "customer_status_id", referencedColumnName = "id")
  private CustomerStatus customerstatus_id;

  @ManyToOne
  @JoinColumn(name = "added_user", referencedColumnName = "id")
  private User added_user_id;

  @ManyToOne
  @JoinColumn(name = "deleted_user", referencedColumnName = "id")
  private User deleted_user_id;

  @ManyToOne
  @JoinColumn(name = "updated_user", referencedColumnName = "id")
  private User updated_user_id;

//  @ManyToOne
//  @JoinColumn(name = "customer_type_id", referencedColumnName = "id")
//  private CustomerType customer_type_id;

  @ManyToOne
  @JoinColumn(name = "customer_category_id", referencedColumnName = "id")
  private CustomerCategory customer_category_id;

  public Customer(Integer id, String customer_code, String customer_name,String mobile,
      String customer_email, CustomerStatus customerstatus_id,
      CustomerCategory customer_category_id ,String contactp_name, String contactp_mobile ) {
    this.id = id;
    this.customer_code = customer_code;
    this.customer_name = customer_name;
    this.mobile = mobile;
    this.customer_email = customer_email;
    this.customerstatus_id = customerstatus_id;
    this.customer_category_id = customer_category_id;
    this.contactp_name = contactp_name;
    this.contactp_mobile = contactp_mobile;
//    this.customer_type_id = customer_type_id;
  }

public char[] getName() {
    return null;
}


//Constructor for corder/cusotmer/list
  public Customer(Integer id,String customer_name,String customer_code){
    this.id = id;
    this.customer_name = customer_name;
    this.customer_code = customer_code;
  }


  public Customer(Long count){
    this.id = Integer.valueOf(count.toString());
  }
}
