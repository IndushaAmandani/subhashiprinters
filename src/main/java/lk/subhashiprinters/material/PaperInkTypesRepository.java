package lk.subhashiprinters.material;

import
        org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaperInkTypesRepository extends JpaRepository<PaperInkTypes,Integer> {

    //?1 - first parameter
//    @Query("select new PaperInkTypes(ppt.id,ppt.name )from PaperInkTypes ppt where ppt.id in ( select pchpit.paper_ink_type_id.id from  pchpit where pchpit.product_category_id.id=?1)" )
//    List<PaperInkTypes> getByProductCategory(Integer ptid);

@Query("select pty from PaperInkTypes pty where pty.material_category_id.id=?1 and pty.name=?2")
PaperInkTypes getPITbyMaterialCategoryandName(Integer materialCategoryid, String pname);

    @Query("select pty from PaperInkTypes pty where pty.material_category_id.id=?1")
    List<PaperInkTypes> getByMCategory(Integer materialCategoryid);

    @Query("select pty from PaperInkTypes pty where pty.material_category_id.id=1")
    List<PaperInkTypes> getPITByPaperCategory();
    @Query("select pty from PaperInkTypes pty where pty.material_category_id.id=2")
    List<PaperInkTypes> getPITByInkCategory();

}
