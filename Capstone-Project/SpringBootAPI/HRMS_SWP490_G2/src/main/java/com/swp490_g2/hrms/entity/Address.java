package com.swp490_g2.hrms.entity;

import com.google.maps.GeocodingApi;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "address")
@AttributeOverride(name = "id", column = @Column(name = "addressId"))
public class Address extends BaseEntity {

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String specificAddress;

    @ManyToOne(optional = false)
    @JoinColumn(name = "wardId", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Ward ward;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    public String getFullAddress() {
        if (ward == null)
            return null;

        return "%s, %s, %s, %s".formatted(specificAddress, ward.getWardName(), ward.getDistrict().getDistrictName(), ward.getDistrict().getCity().getCityName());
    }

    public boolean isValid() {
        return !StringUtils.isEmpty(specificAddress) && ward != null && ward.getId() != null && ward.getId() != 0;
    }
}
