package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface RoleRepository extends JpaRepository<Role, Integer> {

    @Query("select r from Role r where r.id in (select uhr.role_id.id from UserHasRole uhr where uhr.user_id.id=?1)")
    List<Role> getRoleByUser(Integer userid);
}
