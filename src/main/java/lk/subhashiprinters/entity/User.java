package lk.subhashiprinters.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
   private Integer id;

    @Column(name = "username")
   private String username;

   @Column(name = "password")
   private String password;

   @Column(name = "email")
   private String email;

   @Column(name = "photoname")
   private String photoname;

   @Column(name = "photopath")
   private String photopath;

   @Column(name = "status")
   private Boolean status;

   @Column(name = "desription")
   private String desription;

   @Column(name = "addeddatetime")
   private LocalDateTime addeddatetime;

   @Column(name = "updatedatetime")
   private LocalDateTime updatedatetime;

   @ManyToOne
   @JoinColumn(name = "employee_id" ,referencedColumnName = "id")
    private Employee employee_id;


  @ManyToMany
    @JoinTable(name = "user_has_role", joinColumns = @JoinColumn(name = "user_id") ,
                inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

//Repository query
  public User(Integer id, String username, Employee employee_id, String email, Boolean status){
      this.id = id;
      this.username = username;
      this.employee_id = employee_id;
      this.email = email;
      this.status = status;
  }

  
}
