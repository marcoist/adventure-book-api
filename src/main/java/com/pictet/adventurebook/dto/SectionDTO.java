package com.pictet.adventurebook.dto;

import com.pictet.adventurebook.model.Section;
import com.pictet.adventurebook.model.SectionType;

import java.util.List;
import java.util.stream.IntStream;

public record SectionDTO(
        Integer id,
        String text,
        SectionType type,
        List<OptionDTO> options
) {
    public static SectionDTO from(Section section) {
        List<OptionDTO> optionDTOs = IntStream.range(0, section.getOptions().size())
                .mapToObj(i -> OptionDTO.from(section.getOptions().get(i), i))
                .toList();

        return new SectionDTO(
                section.getSectionId(),
                section.getText(),
                section.getType(),
                optionDTOs
        );
    }
}
