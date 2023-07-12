package lk.subhashiprinters.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "supplier_payment")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class SupplierPayment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "bill_no" , unique = true)
    private String bill_no;

    @Column(name = "net_amount")
    private BigDecimal net_amount;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

  @Column(name = "paid_amount")
    private BigDecimal paid_amount;

  @Column(name = "balance_amount")
    private BigDecimal balance_amount;

    @Column(name = "description")
    private String description;

    @Column(name = "bank_name")
    private String bank_name;

    @Column(name = "bank_branch_name")
    private String bank_branch_name;

    @Column(name = "account_holder_name")
    private String account_holder_name;

    @Column(name = "account_number")
    private String account_number;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "update_date")
    private LocalDateTime update_date;

    @Column(name = "delete_date")
    private LocalDateTime delete_date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_payment_type_id" , referencedColumnName = "id")
    private SupplierPaymentType supplier_payment_type_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_payment_status_id" , referencedColumnName = "id")
    private SupplierPaymentStatus supplier_payment_status_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    private Supplier supplier_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "material_recieve_note_id" , referencedColumnName = "id")
    private MRN material_recieve_note_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id" , referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "update_user_id" , referencedColumnName = "id")
    private User update_user_id;

    @ManyToOne
    @JoinColumn(name = "delete_user_id" , referencedColumnName = "id")
    private User delete_user_id;

    public SupplierPayment(Integer id, String bill_no, BigDecimal total_amount , BigDecimal paid_amount,
                           BigDecimal balance_amount ,Supplier supplier_id,MRN material_recieve_note_id,SupplierPaymentType supplier_payment_type_id, SupplierPaymentStatus supplier_payment_status_id){
        this.id = id;
        this.bill_no = bill_no;
        this.total_amount = total_amount;
        this.paid_amount = paid_amount;
        this.balance_amount = balance_amount;
        this.supplier_id = supplier_id;
        this.material_recieve_note_id = material_recieve_note_id;
        this.supplier_payment_type_id = supplier_payment_type_id;
        this.supplier_payment_status_id = supplier_payment_status_id;
    }

}
