package lk.subhashiprinters.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import lk.subhashiprinters.entity.CustomerType;

@Repository
public interface CustomerTypeRepository extends JpaRepository<CustomerType,Integer> {
    
}
