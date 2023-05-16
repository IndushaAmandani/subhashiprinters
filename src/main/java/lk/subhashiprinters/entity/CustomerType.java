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

@Entity //convert class into persisitent obj
@Table(name= "customer_type")
@Data// create getters and setters
@AllArgsConstructor
@NoArgsConstructor

public class CustomerType {
    @Id //primary key 
    @GeneratedValue (strategy = GenerationType.IDENTITY)//auot increment
    private Integer id;

    @Column //map for column name
    private String name;
    
}
