package lk.subhashiprinters.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "privilage")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Privilage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
   private Integer id;

    @Column(name = "sel")
   private Boolean sel;

   @Column(name = "ins")
   private Boolean ins;

   @Column(name = "upd")
   private Boolean upd;

   @Column(name = "del")
   private Boolean del;

   @Column(name = "added_datetime")
   private LocalDateTime added_datetime;

   @Column(name = "last_update_datetime")
   private LocalDateTime  last_update_datetime;

   @Column(name = "delete_datetime")
   private LocalDateTime  delete_datetime;


   @ManyToOne(optional = false)
   @JoinColumn(name = "role_id",referencedColumnName = "id")
   private Role  role_id;

   @ManyToOne(optional = false)
   @JoinColumn(name = "module_id",referencedColumnName = "id")
   private Module  module_id;

   @ManyToOne(optional = false)
   @JoinColumn(name = "added_user_id",referencedColumnName = "id")
   private User  added_user_id;

   @ManyToOne
   @JoinColumn(name = "update_user_id",referencedColumnName = "id")
   private  User  update_user_id;
}
