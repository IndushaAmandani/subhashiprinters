package lk.subhashiprinters.controller;

import lk.subhashiprinters.entity.QuotationHasMaterial;
import lk.subhashiprinters.repository.QuotationMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QuotationMaterialController {
    @Autowired
    private QuotationMaterialRepository quotationMaterialDao;

    @GetMapping(value = "/quotationmaterial/byqm/{qid}/{mid}" ,produces = "application/json")
    public QuotationHasMaterial getByQM(@PathVariable("qid") Integer qid, @PathVariable("mid") Integer mid){
        return quotationMaterialDao.byQidMid(qid,mid);
    }
}
