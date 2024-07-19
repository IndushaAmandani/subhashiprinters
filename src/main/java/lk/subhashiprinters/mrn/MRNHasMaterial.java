package lk.subhashiprinters.mrn;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.subhashiprinters.material.Material;
import lk.subhashiprinters.mrn.MRN;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "material_recieve_note_has_material")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MRNHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "purchase_price")
    private BigDecimal purchase_price;

    @Column(name = "quantity")
    private BigDecimal quantity;

    @Column(name = "line_total")
    private BigDecimal line_total;

    @ManyToOne(optional = false)
    @JoinColumn(name = "material_recieve_note_id" ,referencedColumnName = "id")
    @JsonIgnore
    private MRN material_recieve_note_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id" ,referencedColumnName = "id")
    private Material material_id;

}
