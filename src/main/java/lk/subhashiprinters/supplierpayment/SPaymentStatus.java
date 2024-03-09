package lk.subhashiprinters.supplierpayment;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity  //
@Table(name = "supplier_payment_status") //
@Data // setter , getter ,
@NoArgsConstructor //
@AllArgsConstructor //
public class SPaymentStatus {

    @Id //
    @Column(name = "id") //
    @GeneratedValue(strategy = GenerationType.IDENTITY) //
    private Integer id;

    @Column(name = "name")
    private String name;


}
