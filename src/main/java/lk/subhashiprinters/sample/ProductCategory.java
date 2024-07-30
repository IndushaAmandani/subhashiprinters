package lk.subhashiprinters.sample;

import javax.persistence.*;

import lk.subhashiprinters.material.PaperInkTypes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Entity // convert class into persisten  entity
@Table(name = "product_category") //mapping  into table productcategory
@Data // anno. for gettrs and setters
@AllArgsConstructor
@NoArgsConstructor
public class  ProductCategory {
    @Id //primary key
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id")
  private Integer   id;

    @Column(name = "name")
    private  String name;


    @Column(name = "profit_rate")
    private BigDecimal profit_rate;

    @Column(name ="production_cost")
    private BigDecimal production_cost;


    //??Changes it is going to happen like entity manager operatons (merge,refresh,remove) in customer order will propagate/spread to COHasP entity also
    @ManyToMany // User and Role tables do have many-to-many relationship
    @JoinTable(name = "paper_ink_type_has_product_category" , joinColumns = @JoinColumn(name = "product_category_id"), inverseJoinColumns = @JoinColumn(name = "paper_ink_type_id"))
    private Set<PaperInkTypes> assignedPIT;



}
