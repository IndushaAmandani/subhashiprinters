package lk.subhashiprinters.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_payment")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class CustomerPayment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "customer_payment_bill_number" , unique = true)
    private String customer_payment_bill_number;
    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "pre_balance_amount")
    private BigDecimal pre_balance_amount;

  @Column(name = "paid_amount")
    private BigDecimal paid_amount;

  @Column(name = "after_balance_amount")
    private BigDecimal after_balance_amount;

    @Column(name = "description")
    private String description;

    @Column(name = "bank_name")
    private String bank_name;

    @Column(name = "bank_branchname")
    private String bank_branchname;

    @Column(name = "account_holder_name")
    private String account_holder_name;

    @Column(name = "account_number")
    private String account_number;

    @Column(name = "transfer_id")
    private String transfer_id;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "transfer_date")
    private LocalDate transfer_date;

    @Column(name = "update_date")
    private LocalDateTime update_date;

    @Column(name = "delete_date")
    private LocalDateTime delete_date;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_order_id" , referencedColumnName = "id")
    private CustomerOrder customer_order_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_payment_status_id" , referencedColumnName = "id")
    private CustomerPaymentStatus customer_payment_status_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id" , referencedColumnName = "id")
    private Customer customer_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_payment_type_id" , referencedColumnName = "id")
    private CustomerPaymentType customer_payment_type_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "added_user_id" , referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "update_user_id" , referencedColumnName = "id")
    private User update_user_id;

    @ManyToOne
    @JoinColumn(name = "delete_user_id" , referencedColumnName = "id")
    private User delete_user_id;

    public CustomerPayment(Integer id, String customer_payment_bill_number, BigDecimal total_amount ,BigDecimal pre_balance_amount,BigDecimal paid_amount,
                           BigDecimal after_balance_amount , Customer customer_id, CustomerPaymentType customer_payment_type_id,CustomerPaymentStatus customer_payment_status_id){
        this.id = id;
        this.customer_payment_bill_number = customer_payment_bill_number;
        this.total_amount = total_amount;
        this.pre_balance_amount = pre_balance_amount;
        this.paid_amount = paid_amount;
        this.after_balance_amount = after_balance_amount;
        this.customer_id = customer_id;
        this.customer_payment_type_id = customer_payment_type_id;
        this.customer_payment_status_id = customer_payment_status_id;
    }
    public CustomerPayment(Integer id,String customer_payment_bill_number){
        this.id = id;
        this.customer_payment_bill_number = customer_payment_bill_number;
    }

}
