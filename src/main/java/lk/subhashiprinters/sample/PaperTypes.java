package lk.subhashiprinters.sample;

import javax.persistence.*;

import lk.subhashiprinters.sample.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert class into persisten  entity
@Table(name = "papertype") //mapping  into table
@Data // anno. for gettrs and setters
@AllArgsConstructor
@NoArgsConstructor
public class PaperTypes {
    @Id //primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id")
  private Integer   id;
    @Column(name = "name")
    private  String name;

    @ManyToOne
    @JoinColumn(name = "product_category_id", referencedColumnName = "id")
    private ProductCategory product_category_id;

    public PaperTypes(Integer id,String name){
        this.id = id;
        this.name = name;
    }
}
