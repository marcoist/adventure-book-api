package com.pictet.adventurebook.dto;

import java.util.Set;

public record CategoryUpdateDTO(
        Set<String> add,

        Set<String> remove
) {
    public CategoryUpdateDTO {
        if (add == null) add = Set.of();
        if (remove == null) remove = Set.of();
    }
}
