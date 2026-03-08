package com.pictet.adventurebook.dto;

import com.pictet.adventurebook.model.Consequence;
import com.pictet.adventurebook.model.ConsequenceType;

public record ConsequenceDTO(
        ConsequenceType type,
        Integer value,
        String text
) {
    public static ConsequenceDTO from(Consequence consequence) {
        if (consequence == null || consequence.getType() == null) {
            return null;
        }
        return new ConsequenceDTO(
                consequence.getType(),
                consequence.getValue(),
                consequence.getText()
        );
    }
}
