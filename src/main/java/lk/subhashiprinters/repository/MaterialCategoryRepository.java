package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.entity.MaterialCategory;

@Repository
public interface MaterialCategoryRepository extends JpaRepository<MaterialCategory,Integer> {
    
}
