package lk.subhashiprinters.privilege;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Integer> {

    @Query(value = "select m from Module m where m.id not in (select p.module_id.id from  Privilage p where p.sel=true and p.role_id.id in " +
            "(select uhr.role_id.id from UserHasRole uhr where uhr.user_id.id in (select u.id from User u where u.username=?1)))")
    List<Module> byUsername(String username);
}
