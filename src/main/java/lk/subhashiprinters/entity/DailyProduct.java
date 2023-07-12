package lk.subhashiprinters.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity// convert class into persistenet entity
@Table(name="dailyproduct")
@Data//geters and setters
@AllArgsConstructor
@NoArgsConstructor
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
    @JoinColumn(name="user_id")
    private User user_id;
    @ManyToOne
    @JoinColumn(name="customer_order_id")
    private CustomerOrder customer_order_id;

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product_id;

    public DailyProduct(Integer id,Integer totalqty,Integer completedqty,Integer pre_balance_qty,Integer dailyqty,Integer new_balance_qty,User user_id,CustomerOrder customer_order_id,Product product_id ){
        this.id=id;
        this.totalqty=totalqty;
        this.completedqty =completedqty;
        this.pre_balance_qty=pre_balance_qty;
        this.dailyqty=dailyqty;
        this.new_balance_qty=new_balance_qty;
        this.user_id=user_id;
        this.customer_order_id=customer_order_id;
        this.product_id=product_id;
    }

}
