package lk.subhashiprinters.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "customer_order")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class CustomerOrder implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "order_code")
    private  String order_code;

    @Column(name = "required_date")
    private  LocalDateTime required_date;

    @Column(name = "total_of_lines")
    private BigDecimal total_of_lines;

    @Column(name = "discount")
    private BigDecimal discount;
    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "advanced_amount")
    private BigDecimal advanced_amount;

    @Column(name = "final_balanced_amount")
    private BigDecimal final_balanced_amount;

    @Column(name = "confirmdate")
    private LocalDate confirmdate;
  @Column(name = "paid_amount")
    private BigDecimal paid_amount;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "updated_date")
    private LocalDateTime updated_date;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_status_id" , referencedColumnName = "id")
    private COrderStatus order_status_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "production_status_id" , referencedColumnName = "id")
    private ProductionStatus production_status_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id" , referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "update_user_id" , referencedColumnName = "id")
    private User update_user_id;

    @ManyToOne
    @JoinColumn(name = "delete_user_id" , referencedColumnName = "id")
    private User delete_user_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id" , referencedColumnName = "id")
    private Customer customer_id;



    @OneToMany(cascade = CascadeType.ALL,mappedBy ="customer_order_id", orphanRemoval = true)
    private List<CustomerOrderHasProduct>  customerOrderHasProductList;



    public CustomerOrder(Integer id, String order_code,BigDecimal total_of_lines,BigDecimal discount,BigDecimal total_amount,BigDecimal advanced_amount , BigDecimal paid_amount,
                         BigDecimal final_balanced_amount, COrderStatus order_status_id){
        this.id = id;
        this.order_code = order_code;
        this.total_of_lines = total_of_lines;
        this.discount = discount;
        this.total_amount = total_amount;
        this.advanced_amount = advanced_amount;
        this.paid_amount = paid_amount;
        this.final_balanced_amount = final_balanced_amount;
        this.order_status_id = order_status_id;

    }

    public CustomerOrder(Integer id, String order_code){
        this.id = id;
        this.order_code = order_code;


    }
}
