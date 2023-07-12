package lk.subhashiprinters.entity;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

//
@Entity
@Table(name = "employee")
@Data //
@NoArgsConstructor //
@AllArgsConstructor //
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Employee {

    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//
    @Column(name = "id")
    private Integer id;

    @Column(name = "number")
    private String number;

    @Column(name = "calling_name")
    private String calling_name;

    @Column(name = "fullname")
    private String fullname;

    @Column(name = "nic")
    private String nic;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "land")
    private String land;

    @Column(name = "email")
    private String email;

    @Column(name = "description")
    private String description;

    @Column(name = "gender")
    private String gender;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "address")
    private String address;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "last_update_datetime")
    private LocalDateTime last_update_datetime;

    @Column(name = "delete_date_time")
    private LocalDateTime delete_date_time;

    @ManyToOne //
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id")//
    private Employeestatus employeestatus_id;

    @ManyToOne //
    @JoinColumn(name = "designation_id", referencedColumnName = "id")//
    private Designation designation_id;

    @ManyToOne//
    @JoinColumn(name = "civilstatus_id" ,referencedColumnName = "id")//
    private Civilstatus civilstatus_id;

   // constrouctor function for find all
    public Employee(Integer id, String calling_name, String number, String fullname, String nic, String mobile, String email, Employeestatus employeestatus_id){
      this.id = id;
      this.calling_name = calling_name;
      this.number = number;
      this.fullname = fullname;
      this.nic = nic;
      this.mobile = mobile;
      this.email = email;
      this.employeestatus_id = employeestatus_id;
    }

        //repository 
    public Employee( Integer id, String calling_name, String number, String email){
        this.id = id;
        this.calling_name = calling_name;
        this.number = number;
        this.email = email;
    }
}
