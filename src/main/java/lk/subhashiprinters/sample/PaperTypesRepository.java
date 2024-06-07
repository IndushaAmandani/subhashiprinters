package lk.subhashiprinters.sample;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaperTypesRepository  extends JpaRepository<PaperTypes,Integer> {

    //?1 - first parameter
    @Query("select new PaperTypes(ppt.id,ppt.name )from PaperTypes ppt where ppt.product_category_id.id=?1")
    List<PaperTypes> getByProductCategory(Integer ptid);

@Query("select pty from PaperTypes pty where pty.product_category_id=?1 and pty.name=?2")
    PaperTypes getPTybyPCategoryPname(Integer productCategory,String pname);
}
