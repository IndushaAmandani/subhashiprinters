package lk.subhashiprinters.sample;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

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
