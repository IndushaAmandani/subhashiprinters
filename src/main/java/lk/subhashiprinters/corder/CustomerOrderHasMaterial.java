package lk.subhashiprinters.corder;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.subhashiprinters.material.Material;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity // convert class into persistenet entity
@Table(name = "customer_order_has_material") // Mapping table name
@Data // for create setter and getter to string ..etc
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrderHasMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//As id is auto increment
    @Column(name = "id")
    private Integer id;

    @Column(name="available_quantity")
    private BigDecimal available_quantity;

    @Column(name="required_quantity")
    private BigDecimal required_quantity;

    @ManyToOne(optional = false)
    @JsonIgnore
    @JoinColumn(name = "customer_order_id",referencedColumnName ="id")
    private CustomerOrder customer_order_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id",referencedColumnName ="id")
    private Material material_id;

//    public CustomerOrderHasMaterial(Integer id, CustomerOrder customer_order_id, Product product_id, Integer totalqty, Integer completedqty, Integer dailyqty, Integer new_balance_qty){
//        this.id=id;
//        this.customer_order_id=customer_order_id;
//        this.product_id=product_id;
//        this.totalqty=totalqty;
//        this.completedqty =completedqty;
//        this.dailyqty=dailyqty;
//        this.new_balance_qty=new_balance_qty;
//
//    }


}
