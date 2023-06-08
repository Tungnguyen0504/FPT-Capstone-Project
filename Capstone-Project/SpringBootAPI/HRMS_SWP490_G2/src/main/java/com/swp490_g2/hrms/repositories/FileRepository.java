package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface FileRepository extends JpaRepository<File, Long> {
    Set<File> findByCreatedBy(Long id);
}
