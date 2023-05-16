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

@Entity //map into persistenet object
@Table(name = "product_status") // mapping for table
@Data //For getters and setters
@AllArgsConstructor
@NoArgsConstructor
public class ProductStatus {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id ;
    
    @Column(name = "name")
    private String name; 
    
}
