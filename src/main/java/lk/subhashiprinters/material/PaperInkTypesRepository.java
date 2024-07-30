package lk.subhashiprinters.material;

import
        org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaperInkTypesRepository extends JpaRepository<PaperInkTypes,Integer> {

    //?1 - first parameter
    @Query("select ppt from PaperInkTypes ppt where ppt.material_category_id.id=1 and  ppt.id in (select pchpit.paper_ink_type_id.id from PaperInkTypeHasProductCategory pchpit where pchpit.product_category_id.id=?1)" )
    List<PaperInkTypes> getPaperByProductCategory(Integer ptid);

    @Query("select ppt from PaperInkTypes ppt where ppt.material_category_id.id=2 and  ppt.id in (select pchpit.paper_ink_type_id.id from PaperInkTypeHasProductCategory pchpit where pchpit.product_category_id.id=?1)" )
    List<PaperInkTypes> getInkByProductCategory(Integer ptid);

@Query("select pty from PaperInkTypes pty where pty.material_category_id.id=?1 and pty.name=?2")
PaperInkTypes getPITbyMaterialCategoryandName(Integer materialCategoryid, String pname);

    @Query("select pty from PaperInkTypes pty where pty.material_category_id.id=?1")
    List<PaperInkTypes> getByMroductCategory(Integer mtid);




}
