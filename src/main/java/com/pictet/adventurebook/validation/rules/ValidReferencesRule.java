package com.pictet.adventurebook.validation.rules;

import com.pictet.adventurebook.model.Book;
import com.pictet.adventurebook.model.Option;
import com.pictet.adventurebook.model.Section;
import com.pictet.adventurebook.validation.BookValidationRule;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Validates that all gotoId references point to existing sections.
 */
@Component
public class ValidReferencesRule implements BookValidationRule {

    @Override
    public Optional<String> validate(Book book) {
        Set<Integer> sectionIds = book.getSections().stream()
                .map(Section::getSectionId)
                .collect(Collectors.toSet());

        for (Section section : book.getSections()) {
            for (Option option : section.getOptions()) {
                if (!sectionIds.contains(option.getGotoId())) {
                    return Optional.of(String.format(
                            "Section %d has option pointing to non-existent section %d",
                            section.getSectionId(),
                            option.getGotoId()
                    ));
                }
            }
        }

        return Optional.empty();
    }

    @Override
    public String getRuleName() {
        return "ValidReferences";
    }
}
