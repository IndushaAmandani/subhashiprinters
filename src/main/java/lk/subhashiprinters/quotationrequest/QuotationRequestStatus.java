package lk.subhashiprinters.quotationrequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "quatation_req_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuotationRequestStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    
}
