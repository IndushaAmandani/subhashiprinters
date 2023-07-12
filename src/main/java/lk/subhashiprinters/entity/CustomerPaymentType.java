package lk.subhashiprinters.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity  //convert into persistent class
@Table(name = "customer_payment_type") //Table mapping
@Data // setter , getter ,
@NoArgsConstructor //
@AllArgsConstructor //
public class CustomerPaymentType {

    @Id //
    @Column(name = "id") //
    @GeneratedValue(strategy = GenerationType.IDENTITY) //
    private Integer id;

    @Column(name = "name")
    private String name;


}
