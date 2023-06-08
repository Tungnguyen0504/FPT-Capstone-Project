package com.swp490_g2.hrms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swp490_g2.hrms.entity.enums.RequestingRestaurantStatus;
import com.swp490_g2.hrms.entity.enums.Role;
import com.swp490_g2.hrms.entity.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "user")
@AttributeOverride(name = "id", column = @Column(name = "userId"))
public class User extends BaseEntity implements UserDetails, Cloneable {
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Deprecated
    @Column(nullable = false, columnDefinition = "tinyint(1) default 0", insertable = false)
    private boolean isActive;

    @Column(columnDefinition = "nvarchar(16) default 'INACTIVE'", insertable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus userStatus = UserStatus.INACTIVE;

    @Column(columnDefinition = "VARCHAR(6)")
    private String verificationCode;

    @Column(length = 50)
    @Length(max = 50)
    private String firstName;

    @Column(length = 50)
    @Length(max = 50)
    private String middleName;

    @Column(length = 50)
    @Length(max = 50)
    private String lastName;

    @Column
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
    private Instant dateOfBirth;

    @Column
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
    private Instant requestingOpeningRestaurantDate;


    @Column(columnDefinition = "nvarchar(16) default 'PENDING'")
    @Enumerated(EnumType.STRING)
    private RequestingRestaurantStatus requestingRestaurantStatus = RequestingRestaurantStatus.PENDING;

    @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    private File avatarFile;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    private Address address;

    @ElementCollection(targetClass = Role.class)
    @JoinTable(name = "user__role", joinColumns = @JoinColumn(name = "userId"))
    @Column(name = "roleName", nullable = false)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles;

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.name())).toList();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requestingRestaurantId")
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    private Restaurant requestingRestaurant;

    @Column(columnDefinition = "LONGTEXT")
    private String rejectRestaurantOpeningRequestReasons;

    @ManyToMany(fetch = FetchType.EAGER,
            cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE
            })
    @JoinTable(name = "user__restaurant",
            joinColumns = @JoinColumn(name = "userId"), inverseJoinColumns = @JoinColumn(name = "restaurantId"))
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    @Transient
    private List<Restaurant> restaurants = new ArrayList<>();

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    private List<Notification> notifications = new ArrayList<>();

    @Column(columnDefinition = "LONGTEXT")
    private String bannedReasons;

    /// methods

    public boolean isAdmin() {
        return roles != null && roles.stream().anyMatch(role -> role == Role.ADMIN);
    }

    public boolean isBuyer() {
        return roles != null && roles.stream().anyMatch(role -> role == Role.BUYER);
    }

    public boolean isSeller() {
        return roles != null && roles.stream().anyMatch(role -> role == Role.SELLER);
    }

    public void addRole(Role role) {
        if (roles == null)
            roles = new HashSet<>();

        roles.add(role);
    }

    @Override
    public User clone() {
        try {
            User clone = (User) super.clone();
            // TODO: copy mutable state here, so the clone can't change the internals of the original
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    public String getFullName() {
        if (firstName != null && middleName != null && lastName != null)
            return "%s %s %s".formatted(lastName, middleName, firstName);

        if (firstName != null && lastName != null)
            return "%s %s".formatted(lastName, firstName);

        return null;
    }
}
