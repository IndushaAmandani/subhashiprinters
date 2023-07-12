package lk.subhashiprinters.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@Table(name = "productcopy")
@AllArgsConstructor
@NoArgsConstructor
public class ProductCopy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @ManyToOne(optional = false)
    @JsonIgnore
    @JoinColumn(name = "product_id" ,referencedColumnName = "id")
    private Product product_id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "papercolors_id" ,referencedColumnName = "id")
    private PaperColors papercolors_id;

    @ManyToOne(optional = false)
    @JsonIgnore
    @JoinColumn(name = "papertype_id" ,referencedColumnName = "id")
    private PaperTypes papertype_id;
}
//@JsonIgnore