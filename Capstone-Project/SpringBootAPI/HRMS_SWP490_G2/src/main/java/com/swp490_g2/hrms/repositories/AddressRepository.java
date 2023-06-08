package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.Address;
import com.swp490_g2.hrms.entity.City;
import com.swp490_g2.hrms.entity.District;
import com.swp490_g2.hrms.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Set;

public interface AddressRepository extends JpaRepository<Address, Long> {

    @Query(value = "select * from district where cityId = (:cityId)", nativeQuery = true)
    Set<District> getDistrictsByCityId(Long cityId);

    @Query(value = "select * from ward where cityId = (:districtId)", nativeQuery = true)
    Set<Ward> getWardsByDistrictId(Long districtId);


}
