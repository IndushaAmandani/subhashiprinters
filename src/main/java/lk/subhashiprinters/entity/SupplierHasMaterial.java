package lk.subhashiprinters.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "supplier_has_material")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierHasMaterial implements Serializable {

    @Id
    @ManyToOne
    @JoinColumn(name = "supplier_id",referencedColumnName = "id")
    private Supplier supplier_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "material_id",referencedColumnName = "id")
    private Material material_id;
}
