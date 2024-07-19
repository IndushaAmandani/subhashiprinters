package lk.subhashiprinters.sample;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.subhashiprinters.material.PaperInkTypes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@Table(name = "productcopy")
@AllArgsConstructor
@NoArgsConstructor
public class    ProductCopy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @ManyToOne(optional = false)
    @JsonIgnore
    @JoinColumn(name = "product_id" ,referencedColumnName = "id")
    private Product product_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "paper_type_id" ,referencedColumnName = "id")
    private PaperInkTypes paper_type_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ink_type_id" ,referencedColumnName = "id")
    private PaperInkTypes ink_type_id;
}
//@JsonIgnore