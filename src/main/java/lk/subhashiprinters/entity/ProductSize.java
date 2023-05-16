package lk.subhashiprinters.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity//convert class into persistent entity 
@Table(name = "product_size") // Mapping table name
@Data//creattig getters and setters
@NoArgsConstructor
@AllArgsConstructor

public class ProductSize {
    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//as it's auto incremeted
    
    @Column(name = "id")
    private Integer id ;
    @Column(name = "name")
    private String name ;
     @Column(name = "width")
      private BigDecimal width; 
     @Column(name = "height")
     private  BigDecimal height;
}
