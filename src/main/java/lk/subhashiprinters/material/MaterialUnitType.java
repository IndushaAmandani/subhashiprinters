package lk.subhashiprinters.material;


import javax.persistence.*;


import lk.subhashiprinters.material.MaterialCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //convert to persistent object
@Table(name = "material_unit_type") // mapping for table 
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


    
@ManyToOne
@JoinColumn(name = "material_category_id",referencedColumnName = "id")
private MaterialCategory material_category_id;
}
