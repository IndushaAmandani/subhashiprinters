package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.PaperTypes;
import lk.subhashiprinters.entity.ProductCopy;
import lk.subhashiprinters.entity.PurchaseOrder;
import lk.subhashiprinters.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface ProductCopyRepository extends JpaRepository<ProductCopy,Integer> {

}
