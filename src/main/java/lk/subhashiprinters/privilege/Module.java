package lk.subhashiprinters.privilege;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity//
@Table(name = "module") //
@Data //
@NoArgsConstructor //
@AllArgsConstructor //
public class Module {

    @Id //
    @GeneratedValue(strategy = GenerationType.IDENTITY) //
    @Column(name = "id")
   private Integer id;

    @Column(name = "name")
   private String name;
}
