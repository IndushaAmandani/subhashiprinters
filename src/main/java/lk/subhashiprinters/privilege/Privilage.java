//privilage- slect,insrt,updt,updt,deltt
package lk.subhashiprinters.privilege;

import lk.subhashiprinters.userm.Role;
import lk.subhashiprinters.userm.User;
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
   //privilage- slect,insrt,updt,updt,deltt
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

   @Column(name = "last_update_time")
   private LocalDateTime  last_update_time;

   @Column(name = "delete_date_time")
   private LocalDateTime  delete_date_time;


   @ManyToOne(optional = false)
   @JoinColumn(name = "role_id",referencedColumnName = "id")
   private Role role_id;

   @ManyToOne(optional = false)
   @JoinColumn(name = "module_id",referencedColumnName = "id")
   private Module module_id;

   @ManyToOne(optional = false)//null not allowed
   @JoinColumn(name = "added_user_id",referencedColumnName = "id")
   private User added_user_id;

   @ManyToOne
   @JoinColumn(name = "update_user_id",referencedColumnName = "id")
   private  User  update_user_id;



}
