package lk.subhashiprinters.material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.material.MaterialCategory;


@Repository
public interface MaterialCategoryRepository extends JpaRepository<MaterialCategory,Integer> {


}
