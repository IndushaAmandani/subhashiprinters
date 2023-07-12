package lk.subhashiprinters.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity// object int o persisitent class
@Table(name = "papercolors") //
@Data //getters and setters
@NoArgsConstructor //
@AllArgsConstructor //
public class PaperColors {
    @Id //for primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto inceremtn
    @Column(name = "id")
   private Integer id;

    @Column(name = "name")
   private String name;
}
