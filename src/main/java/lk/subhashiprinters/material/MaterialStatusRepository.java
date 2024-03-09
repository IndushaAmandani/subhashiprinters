package lk.subhashiprinters.material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.material.MaterialStatus;

@Repository
public interface MaterialStatusRepository  extends JpaRepository <MaterialStatus,Integer>{
    

}
