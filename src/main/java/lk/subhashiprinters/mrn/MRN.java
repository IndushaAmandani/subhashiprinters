package lk.subhashiprinters.mrn;


import lk.subhashiprinters.purchaseorder.PurchaseOrder;
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
@Table(name = "material_recieve_note")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MRN {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "recieve_no")
    private String recieve_no;

    @Column(name = "supplier_inovice_no")
    private String supplier_inovice_no;

    @Column(name = "recieve_date")
    private LocalDate recieve_date;

    @Column(name = "added_date")
    private LocalDate added_date;

    @Column(name = "update_date")
    private LocalDate update_date;

    @Column(name = "delete_date")
    private LocalDate delete_date;

    @Column(name = "description")
    private String description;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "discount_rate")
    private BigDecimal discount_rate;

    @Column(name = "tax_rate")
    private BigDecimal tax_rate;

    @Column(name = "net_amount")
    private BigDecimal net_amount;

    @Column(name = "paidamount")
    private BigDecimal paidamount;

    @ManyToOne(optional = false)
    @JoinColumn(name = "purchase_order_id" ,referencedColumnName = "id")
    private PurchaseOrder purchase_order_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "material_recieve_note_status_id" ,referencedColumnName = "id")
    private MRNStatus material_recieve_note_status_id;


    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id" ,referencedColumnName = "id")
    private User added_user_id;

    //To enable crud operation change cascade type into  all,remval not allowed
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "material_recieve_note_id" , orphanRemoval = true )
    private List<MRNHasMaterial> mrnHasMaterialList;


   // mrn.id, mrn.recieve_no, mrn.recieve_date,mrn.net_amount,mrn.purchase_order_id,mrn.material_recieve_note_status_id,mrn.supplier_inovice_no
public MRN(Integer id,String recieve_no,LocalDate recieve_date,BigDecimal net_amount,PurchaseOrder purchase_order_id, MRNStatus material_recieve_note_status_id,String supplier_inovice_no){
    this.id  =id ;
    this.recieve_no = recieve_no;
    this.recieve_date =recieve_date ;
    this.net_amount =net_amount ;
    this.purchase_order_id = purchase_order_id;
    this.material_recieve_note_status_id = material_recieve_note_status_id;
    this.supplier_inovice_no =supplier_inovice_no ;
}

public MRN(Integer id,String recieve_no,LocalDate recieve_date,BigDecimal net_amount,PurchaseOrder purchase_order_id){
    this.id  =id ;
    this.recieve_no = recieve_no;
    this.recieve_date =recieve_date ;
    this.net_amount =net_amount ;
    this.purchase_order_id = purchase_order_id;

}


}
