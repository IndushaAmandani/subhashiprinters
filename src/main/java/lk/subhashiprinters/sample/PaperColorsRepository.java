package lk.subhashiprinters.sample;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.subhashiprinters.sample.PaperColors;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaperColorsRepository extends JpaRepository<PaperColors,Integer> {
@Query("select pcid from PaperColors pcid where pcid.id in(select pthpc.papercolors_id.id from PapertypeHasPapercolors pthpc where pthpc.papertype_id.id=?1)")
   List<PaperColors> getByPaperColorId(Integer ptid);
}
