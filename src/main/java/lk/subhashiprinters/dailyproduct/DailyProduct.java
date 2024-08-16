package lk.subhashiprinters.dailyproduct;


import lk.subhashiprinters.corder.CustomerOrder;
import lk.subhashiprinters.sample.Product;
import lk.subhashiprinters.userm.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
@Entity // convert class into persistenet entity
@Table(name = "dailyproduct") // Mapping table name
@Data // for create setter and getter to string ..etc
@NoArgsConstructor
@AllArgsConstructor
public class DailyProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//As id is auto increment
    @Column(name = "id")
    private Integer id;
    @Column(name="totalqty")
    private Integer totalqty;
    @Column(name="completedqty")
    private Integer completedqty;
    @Column(name="pre_balance_qty")
    private Integer pre_balance_qty;
    @Column(name="dailyqty")
    private Integer dailyqty;
   @Column(name="new_balance_qty")
   private  Integer  new_balance_qty;
    @Column(name="note")
    private Integer note;
   @Column(name="added_date_time")
    private LocalDateTime added_date_time;

   @ManyToOne
    @JoinColumn(name="added_user_id")
    private User added_user_id;
    @ManyToOne
    @JoinColumn(name="customer_order_id")
    private CustomerOrder customer_order_id;
    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product_id;

    public DailyProduct(Integer id,CustomerOrder customer_order_id,Product product_id,Integer totalqty,Integer completedqty,Integer dailyqty,Integer new_balance_qty){
        this.id=id;
        this.customer_order_id=customer_order_id;
        this.product_id=product_id;
        this.totalqty=totalqty;
        this.completedqty =completedqty;
        this.dailyqty=dailyqty;
        this.new_balance_qty=new_balance_qty;

    }
    public DailyProduct(Integer id,Integer completedqty,Integer pre_balance_qty){
                this.id =id ;
                this.completedqty = completedqty;
                this.completedqty = pre_balance_qty;
    }

}
