package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.entity.CustomerCategory;
@Repository
public interface CustomerCategoryRepository extends JpaRepository<CustomerCategory,Integer>{
    
}
