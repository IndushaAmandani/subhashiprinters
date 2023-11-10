package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    //users without admin
    @Query("select new User(u.id,u.username,u.employee_id,u.email,u.status) from User u "+
  "where u.username <> 'Admin' order by u.id DESC ")
    List<User> findAll();

  /*  @Query(value = "select u from User u where u.employee_id.id=?1")
    User getReferenceById(Integer eid);*/

@Query(value = "select u from User u where u.username =?1")
    //use for get user by given username
    User findUserByUsername(String username);
}
