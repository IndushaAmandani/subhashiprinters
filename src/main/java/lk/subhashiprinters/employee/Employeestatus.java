package lk.subhashiprinters.employee;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity//
@Table(name = "employeestatus") //
@Data //
@NoArgsConstructor //
@AllArgsConstructor //
public class Employeestatus {

    @Id //
    @GeneratedValue(strategy = GenerationType.IDENTITY) //
    @Column(name = "id")
   private Integer id;

    @Column(name = "name")
   private String name;
}
