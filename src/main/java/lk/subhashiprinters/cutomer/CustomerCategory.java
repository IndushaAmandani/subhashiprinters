package lk.subhashiprinters.cutomer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
@Entity//convert class into  persistent entity
@Table(name = "customer_category") //provide mapping for table customer_category
@Data//getters and setters
@NoArgsConstructor
@AllArgsConstructor

public class CustomerCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name ="name")
    private String name;
}
