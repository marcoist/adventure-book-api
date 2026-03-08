package com.pictet.adventurebook.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Consequence {

    @Enumerated(EnumType.STRING)
    private ConsequenceType type;

    private Integer value;

    private String text;
}
