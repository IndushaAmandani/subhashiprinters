package lk.subhashiprinters.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity // convert class into persistenet entity
@Table(name = "materialinventory") // Mapping table name
@Data // for create setter and getter to string ..etc
@NoArgsConstructor
@AllArgsConstructor
public class MaterialInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//As id is auto increment
    @Column(name = "id")
    private Integer id;
    @Column(name="totalqty")
    private BigDecimal totalqty;

    @Column(name="avaqty")
    private BigDecimal avaqty;

   @Column(name="removeqty")
   private  BigDecimal  removeqty;

   @ManyToOne
    @JoinColumn(name="inventorystatus_id")
    private InventoryStatus inventorystatus_id;
    @ManyToOne
    @JoinColumn(name="material_id")
    private Material material_id;

//    public MaterialInventory(Integer id, Integer totalqty, Integer avaqty, Integer removeqty, InventoryStatus inventorystatus_id,Material material_id){
//        this.id=id;
//        this.totalqty=totalqty;
//        this.avaqty =avaqty;
//        this.removeqty=removeqty;
//
//        this.material_id=material_id;
//
//    }
//    public MaterialInventory(Integer id, Integer completedqty, Integer pre_balance_qty){
//                this.id =id ;
//                this.completedqty = completedqty;
//                this.completedqty = pre_balance_qty;
//    }

}
