package com.pictet.adventurebook.dto;

import com.pictet.adventurebook.model.Option;

public record OptionDTO(
        int index,
        String description,
        boolean hasConsequence
) {
    public static OptionDTO from(Option option, int index) {
        return new OptionDTO(
                index,
                option.getDescription(),
                option.getConsequence() != null && option.getConsequence().getType() != null
        );
    }
}
