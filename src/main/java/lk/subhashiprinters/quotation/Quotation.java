package lk.subhashiprinters.quotation;

import lk.subhashiprinters.quotationrequest.QuotationRequest;
import lk.subhashiprinters.userm.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity // convert class into persistenet entity
@Table(name = "quatation") // Mapping table name
@Data // for create setter and getter to string ..etc
@NoArgsConstructor
@AllArgsConstructor

public class Quotation {

  @Id //mapping to the id as primary key
  @GeneratedValue(strategy = GenerationType.IDENTITY) // As Id is autoincremented
  //mapping to the column
  @Column(name = "id")
  private Integer id;

  @Column(name = "number")
  private String number;

  @Column(name = "recieve_date")
  private LocalDate recieve_date;

  @Column(name = "valid_period")
  private LocalDate valid_period;

  @Column(name = "added_date")
  private LocalDateTime added_date;

  @Column(name = "updated_date")
  private LocalDateTime updated_date;

  @Column(name = "delete_date")
  private LocalDateTime delete_date;

  @Column(name = "note")
  private String note;

  @ManyToOne
  @JoinColumn(name = "quatation_status_id", referencedColumnName = "id")
  private QuotationStatus quatation_status_id;

  @ManyToOne
  @JoinColumn(name = "added_user_id", referencedColumnName = "id")
  private User added_user_id;

  @ManyToOne
  @JoinColumn(name = "updateuser_id", referencedColumnName = "id")
  private User updateuser_id;

  @ManyToOne
  @JoinColumn(name = "deleteuser_id", referencedColumnName = "id")
  private User deleteuser_id;

  @ManyToOne
  @JoinColumn(name = "quatation_request_id", referencedColumnName = "id")
  private QuotationRequest quatation_request_id;


  @OneToMany(cascade = CascadeType.ALL,mappedBy = "quatation_id" , orphanRemoval = true )
  private List<QuotationHasMaterial> quotationHasMaterialList;

  public Quotation(Integer id, String number ) {
    this.id = id;
    this.number = number;
  }

  public Quotation(Integer id, String number, LocalDate recieve_date, LocalDate valid_period, QuotationRequest quatation_request_id,
                   QuotationStatus quatation_status_id  ) {
    this.id = id;
    this.number = number;
    this.recieve_date = recieve_date;
    this.valid_period = valid_period;
    this.quatation_request_id = quatation_request_id;
    this.quatation_status_id = quatation_status_id;

  }

}
