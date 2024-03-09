package lk.subhashiprinters.corder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "production_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;




    
    
}
