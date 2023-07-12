package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.Privilage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilageRepository extends JpaRepository<Privilage,Integer> {

    @Query(value = "SELECT  bit_or(p.slect), bit_or(p.insrt), bit_or(p.updt), bit_or(p.deltt) FROM subhashiprinters.privilage as p " +
            "where p.role_id in (select uhr.role_id from subhashiprinters.user_has_role as uhr " +
            "where uhr.user_id in (select u.id from subhashiprinters.user as u " +
            "where u.username=?1)) and p.module_id in (select m.id from subhashiprinters.module as m " +
            "where m.name=?2);" , nativeQuery = true)
    String getPrivilageByUserModule(String Username , String modulename);
}
