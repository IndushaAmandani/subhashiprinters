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

@Entity //convert to persistent object
@Table(name = "materal_unit_type") // mapping for table 
@Data// for getters and setters
@AllArgsConstructor
@NoArgsConstructor
public class MaterialUnitType {
    
    @Id // for primary key 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;
}
