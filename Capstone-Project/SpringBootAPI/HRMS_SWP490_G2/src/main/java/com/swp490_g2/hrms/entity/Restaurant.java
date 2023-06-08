package com.swp490_g2.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swp490_g2.hrms.common.utils.DateUtils;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "restaurant")
@AttributeOverride(name = "id", column = @Column(name = "restaurantId"))
public class Restaurant extends BaseEntity {

    @Column(nullable = false)
    private String restaurantName;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(unique = true)
    private String phoneNumber;

    @Column(nullable = false, columnDefinition = "tinyint(1) default 0")
    private boolean isActive = false;

    @ManyToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    private File avatarFile;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @Transient
    private Set<Product> products;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    private Address address;

    @ManyToMany(cascade = {CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(name = "restaurant__restaurant_category",
            joinColumns = @JoinColumn(name = "restaurantId"), inverseJoinColumns = @JoinColumn(name = "restaurantCategoryId"))
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    private List<RestaurantCategory> restaurantCategories;

    @Column
    private String openTime;

    @Column
    private String closedTime;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    private BankDetail bankDetail;

    @Column(columnDefinition = "LONGTEXT")
    private String deactivateReasons;

    /// Methods

    public boolean isOpening() {
        if (openTime == null || closedTime == null) {
            return false;
        }

        LocalTime now = LocalTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        if (Objects.requireNonNull(DateUtils.toLocalTime(openTime)).isBefore(DateUtils.toLocalTime(closedTime))) {
            return Objects.requireNonNull(DateUtils.toLocalTime(openTime)).isBefore(now)
                    && now.isBefore(DateUtils.toLocalTime(closedTime));
        }

        return !(Objects.requireNonNull(DateUtils.toLocalTime(closedTime)).isBefore(now)
                && now.isBefore(DateUtils.toLocalTime(openTime)));
    }

    /// Request fields
    @Transient
    private List<User> owners = new ArrayList<>();

    @Transient
    private Float averageStars = 0f;
}
