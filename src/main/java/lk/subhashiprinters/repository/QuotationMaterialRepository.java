package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.QuotationHasMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuotationMaterialRepository extends JpaRepository<QuotationHasMaterial ,Integer> {


    @Query("select qhm from QuotationHasMaterial qhm where qhm.quatation_id.id=?1 and qhm.material_id.id=?2")
    QuotationHasMaterial byQidMid(Integer qid, Integer mid);
}
