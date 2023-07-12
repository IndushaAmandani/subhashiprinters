package lk.subhashiprinters.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "papertype_has_papercolors")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PapertypeHasPapercolors implements Serializable {

    @Id
    @ManyToOne
    @JoinColumn(name="papertype_id",referencedColumnName ="id")
    private  PaperTypes papertype_id;


    @Id
    @ManyToOne
    @JoinColumn(name="papercolors_id",referencedColumnName ="id")
    private PaperColors papercolors_id;
}
