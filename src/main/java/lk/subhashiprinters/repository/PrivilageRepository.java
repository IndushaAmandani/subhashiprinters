package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.Privilage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilageRepository extends JpaRepository<Privilage,Integer> {

    @Query(value = "SELECT  bit_or(p.sel), bit_or(p.ins), bit_or(p.upd), bit_or(p.del) FROM bitproject22col.privilage as p " +
            "where p.role_id in (select uhr.role_id from bitproject22col.user_has_role as uhr " +
            "where uhr.user_id in (select u.id from bitproject22col.user as u " +
            "where u.username=?1)) and p.module_id in (select m.id from bitproject22col.module as m " +
            "where m.name=?2);" , nativeQuery = true)
    String getPrivilageByUserModule(String Username , String modulename);
}
