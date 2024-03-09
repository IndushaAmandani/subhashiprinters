package lk.subhashiprinters.sample;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.subhashiprinters.sample.PrintColors;

public interface PrintColorsRepository extends JpaRepository <PrintColors,Integer>  {
    
}
