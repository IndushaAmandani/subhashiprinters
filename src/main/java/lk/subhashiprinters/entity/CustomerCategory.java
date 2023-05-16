package lk.subhashiprinters.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity//convert class into  persistent entity
@Table(name = "customer_category") //provide mapping for table customer_category
@Data //getters and setters
@AllArgsConstructor
@NoArgsConstructor
public class CustomerCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name ="name")
    private String name;
}
