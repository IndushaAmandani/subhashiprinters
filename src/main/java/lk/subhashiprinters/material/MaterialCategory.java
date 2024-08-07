package lk.subhashiprinters.material;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //convert class into persistent object 
@Table(name = "material_category")//mapping to table material status
@Data // for getters and setters
@AllArgsConstructor
@NoArgsConstructor
public class MaterialCategory {
    
    @Id // for primary key 
    @GeneratedValue(strategy = GenerationType.IDENTITY) //annotation for auto incremet
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;
    


}
