package lk.subhashiprinters.corder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "order_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class COrderStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

//    public COrderStatus getReferenceById(int i) {
//        return null;
//    }


    
    
}
