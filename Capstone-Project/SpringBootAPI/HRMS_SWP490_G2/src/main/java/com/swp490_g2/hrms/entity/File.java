package com.swp490_g2.hrms.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "file")
@AttributeOverride(name = "id", column = @Column(name = "fileId"))
public class File extends BaseEntity{
    @Column(nullable = false)
    private String filePath;
}
