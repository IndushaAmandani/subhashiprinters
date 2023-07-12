package lk.subhashiprinters.entity;

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

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity// convert class into persistenet entity
@Table(name = "material") // Mapping table name
@Data// for create setter and getter
@AllArgsConstructor
@NoArgsConstructor
public class Material {

    @Id //for priumary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //for auto incerment
    @Column(name = "id")
    private Integer id;

@Column(name ="name ")
private String  name; 
@Column(name ="code")
private String code;
@Column(name ="added_date")
private LocalDateTime added_date;
@Column(name ="update_date")
private LocalDateTime update_date;
@Column(name ="deleted_date")
private LocalDateTime deleted_date;
@Column(name ="description")
private String description; 
@Column(name ="measuring_count")
private  BigDecimal measuring_count;    

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
@JoinColumn(name ="material_category_id",referencedColumnName = "id")
private MaterialCategory material_category_id;

@ManyToOne
@JoinColumn(name ="material_status_id",referencedColumnName = "id" )
private MaterialStatus material_status_id ; 

@ManyToOne
@JoinColumn(name ="materal_unit_type_id",referencedColumnName = "id")
private MaterialUnitType materal_unit_type_id ;


    public  Material(Integer id,String name,String code,BigDecimal measuring_count) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.measuring_count = measuring_count;
    }

public  Material(Integer id, String name, String code, BigDecimal measuring_count, MaterialCategory material_category_id, MaterialUnitType materal_unit_type_id, MaterialStatus material_status_id){
    this.id = id;
    this.name = name;
    this.code = code;
    this.measuring_count = measuring_count;
    this.material_category_id = material_category_id;
    this.materal_unit_type_id = materal_unit_type_id;
    this.material_status_id = material_status_id;

}
}
