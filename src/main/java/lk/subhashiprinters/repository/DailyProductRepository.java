package lk.subhashiprinters.repository;

import lk.subhashiprinters.entity.DailyProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyProductRepository extends JpaRepository<DailyProduct,Integer> {
}
