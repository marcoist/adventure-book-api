package com.pictet.adventurebook.dto;

import jakarta.validation.constraints.NotNull;

public record StartGameDTO(
        @NotNull(message = "Book ID is required")
        Long bookId
) {
}
