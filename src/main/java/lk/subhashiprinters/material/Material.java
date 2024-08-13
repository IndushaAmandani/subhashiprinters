package lk.subhashiprinters.material;

import java.math.BigDecimal;
import java.time.LocalDateTime;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lk.subhashiprinters.userm.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity// convert class into persistenet entity
@Table(name = "material") // Mapping table name
@Data// for create setter and getter
@NoArgsConstructor
@AllArgsConstructor
public class Material {

    @Id //for priumary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //for auto incerment
    @Column(name = "id")
    private Integer id;
    //m.id, m.name, m.code,m.measuring_count,m.width,m.height,m.material_category_id, m.material_unit_type_id, m.material_status_id
    @Column(name = "name")
    private String name;
    @Column(name = "code")
    private String code;
    @Column(name = "added_date")
    private LocalDateTime added_date;
    @Column(name = "update_date")
    private LocalDateTime update_date;
    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;
    @Column(name = "description")
    private String description;
    @Column(name = "width")
    private BigDecimal width;
    @Column(name = "height")
    private BigDecimal height;

    @Column(name = "unit_price")
    private BigDecimal unit_price;

    @ManyToOne
    @JoinColumn(name = "added_user_id", referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "delete_user_id", referencedColumnName = "id")
    private User delete_user_id;

    @ManyToOne
    @JoinColumn(name = "update_user_id", referencedColumnName = "id")
    private User update_user_id;


    @ManyToOne
    @JoinColumn(name = "material_category_id", referencedColumnName = "id")
    private MaterialCategory material_category_id;

    @ManyToOne
    @JoinColumn(name = "material_status_id", referencedColumnName = "id")
    private MaterialStatus material_status_id;

    @ManyToOne
    @JoinColumn(name = "material_unit_type_id", referencedColumnName = "id")
    private MaterialUnitType material_unit_type_id;

    @ManyToOne
    @JoinColumn(name = "paper_ink_type_id", referencedColumnName = "id")
    private PaperInkTypes paper_ink_type_id;


//m.id, m.name, m.code,m.measuring_count,m.width,m.height,m.material_category_id, m.material_unit_type_id, m.material_status_id

    public Material(Integer id, String name, String code,MaterialCategory material_category_id, BigDecimal width, BigDecimal height, MaterialStatus material_status_id, MaterialUnitType material_unit_type_id) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.material_category_id = material_category_id;
        this.width = width;
        this.height = height;
        this.material_unit_type_id = material_unit_type_id;
        this.material_status_id = material_status_id;


    }

    public Material(Integer id, String name, String code, BigDecimal unit_price, BigDecimal width, BigDecimal height) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.unit_price = unit_price;
        this.width = width;
        this.height = height;

    }

}
