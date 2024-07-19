package lk.subhashiprinters.sample;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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





}
