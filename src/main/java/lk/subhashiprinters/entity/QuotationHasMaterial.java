package lk.subhashiprinters.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "quatation_has_material")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuotationHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "purchase_price")
    private BigDecimal purchase_price;

    @ManyToOne(optional = false)
    @JoinColumn(name = "quatation_id" ,referencedColumnName = "id")
    @JsonIgnore
    private Quotation quatation_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id" ,referencedColumnName = "id")
    private Material material_id;

}
