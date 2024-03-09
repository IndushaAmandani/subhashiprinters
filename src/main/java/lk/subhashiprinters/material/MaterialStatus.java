package lk.subhashiprinters.material;

import javax.persistence.*;

import lombok.*;

@Entity
@Table(name = "material_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialStatus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

}
