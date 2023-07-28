package lk.subhashiprinters.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@Table(name = "product_has_material")
@AllArgsConstructor
@NoArgsConstructor
public class ProductHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @ManyToOne(optional = false)
    @JsonIgnore
    @JoinColumn(name = "product_id" ,referencedColumnName = "id")
    private Product product_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id" ,referencedColumnName = "id")
    private Material material_id;

    @Column(name = "quantity")
    private  Integer quantity;

}
//@JsonIgnore