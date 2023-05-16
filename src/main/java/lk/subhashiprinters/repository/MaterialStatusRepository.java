package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.entity.MaterialStatus;

@Repository
public interface MaterialStatusRepository  extends JpaRepository <MaterialStatus,Integer>{
    

}
