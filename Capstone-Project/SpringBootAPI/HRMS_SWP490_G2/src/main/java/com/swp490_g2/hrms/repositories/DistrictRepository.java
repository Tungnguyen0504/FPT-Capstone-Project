package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.City;
import com.swp490_g2.hrms.entity.District;
import com.swp490_g2.hrms.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DistrictRepository extends JpaRepository<District, Long>, JpaSpecificationExecutor<District> {

}
