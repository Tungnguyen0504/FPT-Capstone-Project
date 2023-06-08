package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductStatusRepository extends JpaRepository<ProductStatus, Long>, JpaSpecificationExecutor<ProductStatus> {
}
