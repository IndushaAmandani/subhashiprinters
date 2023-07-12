package lk.subhashiprinters.controller;

import lk.subhashiprinters.entity.CustomerOrderHasProduct;
import lk.subhashiprinters.entity.QuotationHasMaterial;
import lk.subhashiprinters.repository.CustomerOrderProductRepository;
import lk.subhashiprinters.repository.CustomerOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/customerOrderHasproduct")
public class CustomerOrderHasProductController {

    @Autowired // for create instance
    private CustomerOrderProductRepository CustomerOrderHasProductDao;

    @GetMapping(value = "/orderedQtyBycoidPid/{coid}/{pid}" ,produces = "application/json")
    public CustomerOrderHasProduct getByCOPid(@PathVariable("coid") Integer coid, @PathVariable("pid") Integer pid){
        return CustomerOrderHasProductDao.byCoidPid(coid,pid);
    }
}
