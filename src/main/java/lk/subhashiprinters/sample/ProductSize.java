package lk.subhashiprinters.sample;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.*;

import lk.subhashiprinters.sample.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity//convert class into persistent entity 
@Table(name = "product_size") // Mapping table name
@Data//creattig getters and setters
@NoArgsConstructor
@AllArgsConstructor

public class ProductSize implements Serializable {
    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//as it's auto incremeted

    @Column(name = "id")
    private Integer id;
    @Column(name = "name")
    private String name;
    @Column(name = "width")
    private BigDecimal width;
    @Column(name = "height")
    private BigDecimal height;

    @ManyToOne
    @JoinColumn(name = "product_category_id", referencedColumnName = "id")
    private ProductCategory product_category_id;


    //constructor function
    public ProductSize(Integer id,String name) {
    this.id= id;
    this.name = name;

    }
}