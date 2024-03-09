package lk.subhashiprinters.sample;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductHasMaterialRepository extends JpaRepository<ProductHasMaterial,Integer> {

}

