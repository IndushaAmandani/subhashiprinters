package lk.subhashiprinters.purchaseorder;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/PorderHasMaterial")
public class PurchaseOrderHasMaterialController {

    @Autowired
    private PurchaseOrderHasMaterialRepository purchaseOrderHasMaterialDao;


    @GetMapping(value = "/getMaterialbyPordr/{poid}/{mid}",produces = "application/json")
    public PurchaseOrderHasMaterial getMbyPorder(@PathVariable ("poid") Integer poid,@PathVariable("mid")Integer mid){
        return purchaseOrderHasMaterialDao.getMbyPOrder(poid,mid);
    }



}
