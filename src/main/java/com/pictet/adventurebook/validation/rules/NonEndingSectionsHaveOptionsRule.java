package com.pictet.adventurebook.validation.rules;

import com.pictet.adventurebook.model.Book;
import com.pictet.adventurebook.model.Section;
import com.pictet.adventurebook.model.SectionType;
import com.pictet.adventurebook.validation.BookValidationRule;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Validates that all non-END sections have at least one option.
 */
@Component
public class NonEndingSectionsHaveOptionsRule implements BookValidationRule {

    @Override
    public Optional<String> validate(Book book) {
        for (Section section : book.getSections()) {
            if (section.getType() != SectionType.END &&
                (section.getOptions() == null || section.getOptions().isEmpty())) {
                return Optional.of(String.format(
                        "Section %d is not an END section but has no options",
                        section.getSectionId()
                ));
            }
        }

        return Optional.empty();
    }

    @Override
    public String getRuleName() {
        return "NonEndingSectionsHaveOptions";
    }
}
