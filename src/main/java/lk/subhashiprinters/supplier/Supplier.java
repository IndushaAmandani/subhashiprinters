package lk.subhashiprinters.supplier;


import lk.subhashiprinters.material.Material;
import lk.subhashiprinters.userm.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "supplier")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Supplier implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "reg_no" , unique = true)
    private String reg_no;

    @Column(name = "company_name")
    private String company_name;

    @Column(name = "company_registration_number")
    private String company_registration_number;

  @Column(name = "contact_person_name")
    private String contact_person_name;

  @Column(name = "contact_person_number")
    private String contact_person_number;

    @Column(name = "address ")
    private String address ;

    @Column(name = "description  ")
    private String description  ;

    @Column(name = "company_email" ,unique = true)
    private String company_email;

    @Column(name = "company_contact_no")
    private String company_contact_no;

    @Column(name = "bank_name")
    private String bank_name;

    @Column(name = "branch_name")
    private String branch_name;

    @Column(name = "account_number")
    private String account_number;

    @Column(name = "account_holder_name")
    private String account_holder_name;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "added_datetime")
    private LocalDateTime added_datetime;

    @Column(name = "update_datetime")
    private LocalDateTime update_datetime;

    @Column(name = "delete_datetime")
    private LocalDateTime delete_datetime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_status_id" , referencedColumnName = "id")
    private SupplierStatus supplier_status_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id" , referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "update_user_id" , referencedColumnName = "id")
    private User update_user_id;

    @ManyToOne
    @JoinColumn(name = "delete_user_id" , referencedColumnName = "id")
    private User delete_user_id;

    @ManyToMany
    @JoinTable(name = "supplier_has_material" ,joinColumns = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name = "material_id"))
    private Set<Material> materialList;

    public Supplier(Integer id, String reg_no, String company_name, BigDecimal amount) {
        this.id = id;
        this.reg_no = reg_no;
        this.company_name = company_name;
        this.amount = amount;
    }

    public Supplier(Integer id, String reg_no, String company_name ,String company_email, String company_contact_no ,SupplierStatus supplier_status_id){
        this.id = id;
        this.reg_no = reg_no;
        this.company_name = company_name;
        this.company_email = company_email;
        this.company_contact_no = company_contact_no;
        this.supplier_status_id = supplier_status_id;
    }

}
