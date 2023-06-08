package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface CityRepository extends JpaRepository<City, Long>, JpaSpecificationExecutor<City> {

}
