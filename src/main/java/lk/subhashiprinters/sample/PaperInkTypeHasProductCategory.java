package lk.subhashiprinters.sample;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.subhashiprinters.material.Material;
import lk.subhashiprinters.material.PaperInkTypes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "paper_ink_type_has_product_category")
@AllArgsConstructor
@NoArgsConstructor
public class PaperInkTypeHasProductCategory implements Serializable {

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_category_id" ,referencedColumnName = "id")
    private ProductCategory product_category_id;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "paper_ink_type_id" ,referencedColumnName = "id")
    private PaperInkTypes paper_ink_type_id;



}
//@JsonIgnore