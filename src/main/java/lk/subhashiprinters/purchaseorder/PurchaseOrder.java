package lk.subhashiprinters.purchaseorder;


import lk.subhashiprinters.quotation.Quotation;
import lk.subhashiprinters.supplier.Supplier;
import lk.subhashiprinters.userm.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "purchase_order")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "order_no")
    private String order_no;

    @Column(name = "required_date")
    private LocalDate required_date;

    @Column(name = "addeddatetime")
    private LocalDateTime addeddatetime;

    @Column(name = "updatedateitme")
    private LocalDateTime updatedateitme;

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id" ,referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "quatation_id" ,referencedColumnName = "id")
    private Quotation quatation_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "purchase_order_status_id" ,referencedColumnName = "id")
    private PorderStatus purchase_order_status_id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id" ,referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "update_user_id" ,referencedColumnName = "id")
    private User update_user_id;

    @ManyToOne
    @JoinColumn(name = "delete_user_id" ,referencedColumnName = "id")
    private User delete_user_id;


    @OneToMany(cascade = CascadeType.ALL,mappedBy = "purchase_order_id" , orphanRemoval = true )
    private List<PurchaseOrderHasMaterial> purchaseOrderHasMaterialList;

    public PurchaseOrder(Integer id, String order_no, LocalDate required_date, BigDecimal total_amount, Quotation quatation_id,
                     PorderStatus purchase_order_status_id  ) {
        this.id = id;
        this.order_no = order_no;
        this.required_date = required_date;
        this.total_amount = total_amount;
        this.quatation_id = quatation_id;
        this.purchase_order_status_id = purchase_order_status_id;

    }
    public PurchaseOrder( Integer id,Supplier supplier_id, Quotation quatation_id){
        this.id = id;
        this.supplier_id = supplier_id;
        this.quatation_id = quatation_id;
    }

}
