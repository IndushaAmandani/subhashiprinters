package lk.subhashiprinters.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "customer_order_has_product")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerOrderHasProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "product_cost")
    private BigDecimal product_cost;

    @Column(name = "line_total")
    private BigDecimal line_total;

    @Column(name = "order_qty")
    private Integer order_qty;

    @Column(name = "completedqty")
    private Integer completedqty;

@ManyToOne(optional = false)
    @JoinColumn(name = "production_status_id",referencedColumnName ="id")
private ProductionStatus production_status_id;

// @JsonIgnore - to specify a method or field that should be ignored during serialization and deserialization processes
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id" ,referencedColumnName = "id")
    private Product product_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_order_id" ,referencedColumnName = "id")
    @JsonIgnore
    private CustomerOrder customer_order_id;




}
