package lk.subhashiprinters.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity // convert class into persistenet entity
@Table(name = "quatation_request") // Mapping table name
@Data // for create setter and getter to string ..etc
@NoArgsConstructor
@AllArgsConstructor

public class QuotationRequest {

    @Id //mapping to the id as primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // As Id is autoincremented
    //mapping to the column
    @Column(name = "id")
    private Integer id;

    @Column(name = "request_number")
    private String request_number;

    @Column(name = "required_date")
    private LocalDate required_date;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "update_date")
    private LocalDateTime update_date;

    @Column(name = "delete_date")
    private LocalDateTime delete_date;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "quatation_req_status_id", referencedColumnName = "id")
    private QuotationRequestStatus quatation_req_status_id;

    @ManyToOne
    @JoinColumn(name = "added_user_id", referencedColumnName = "id")
    private User added_user_id;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;


    public QuotationRequest(Integer id, String request_number, Supplier supplier_id) {
        this.id = id;
        this.request_number = request_number;
        this.supplier_id = supplier_id;
    }

    public QuotationRequest(Integer id, String request_number, LocalDate required_date, Supplier supplier_id,
                            QuotationRequestStatus quatation_req_status_id) {
        this.id = id;
        this.request_number = request_number;
        this.required_date = required_date;
        this.supplier_id = supplier_id;
        this.quatation_req_status_id = quatation_req_status_id;

    }

}
