package lk.subhashiprinters.purchaseorder;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.subhashiprinters.material.Material;
import lk.subhashiprinters.purchaseorder.PurchaseOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_has_material")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "purchase_price")
    private BigDecimal purchase_price;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "line_total")
    private BigDecimal line_total;

    @ManyToOne(optional = false)
    @JoinColumn(name = "purchase_order_id" ,referencedColumnName = "id")
    @JsonIgnore
    private PurchaseOrder purchase_order_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id" ,referencedColumnName = "id")
    private Material material_id;

}
