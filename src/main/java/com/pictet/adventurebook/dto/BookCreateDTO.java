package com.pictet.adventurebook.dto;

import com.pictet.adventurebook.model.Difficulty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Set;

public record BookCreateDTO(
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Author is required")
        String author,

        @NotNull(message = "Difficulty is required")
        Difficulty difficulty,

        Set<String> categories,

        @NotEmpty(message = "Sections are required")
        @Valid
        List<SectionCreateDTO> sections
) {
    public record SectionCreateDTO(
            @NotNull(message = "Section ID is required")
            Integer id,

            @NotBlank(message = "Section text is required")
            String text,

            @NotBlank(message = "Section type is required")
            String type,

            List<OptionCreateDTO> options
    ) {}

    public record OptionCreateDTO(
            @NotBlank(message = "Option description is required")
            String description,

            @NotNull(message = "gotoId is required")
            Integer gotoId,

            ConsequenceCreateDTO consequence
    ) {}

    public record ConsequenceCreateDTO(
            @NotBlank(message = "Consequence type is required")
            String type,

            @NotNull(message = "Consequence value is required")
            Integer value,

            String text
    ) {}
}
