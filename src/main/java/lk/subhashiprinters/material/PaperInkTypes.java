package lk.subhashiprinters.material;

import javax.persistence.*;

import lk.subhashiprinters.corder.CustomerOrderHasProduct;
import lk.subhashiprinters.material.MaterialCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity // convert class into persisten  entity
@Table(name = "paper_ink_type") //mapping  into table
@Data // anno. for gettrs and setters
@AllArgsConstructor
@NoArgsConstructor
public class PaperInkTypes {
    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "material_category_id", referencedColumnName = "id")
    private MaterialCategory material_category_id;



}
