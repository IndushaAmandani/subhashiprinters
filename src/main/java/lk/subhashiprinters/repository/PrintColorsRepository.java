package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.subhashiprinters.entity.PrintColors;

public interface PrintColorsRepository extends JpaRepository <PrintColors,Integer>  {
    
}
