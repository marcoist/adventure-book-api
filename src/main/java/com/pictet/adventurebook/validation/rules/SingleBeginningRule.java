package com.pictet.adventurebook.validation.rules;

import com.pictet.adventurebook.model.Book;
import com.pictet.adventurebook.model.SectionType;
import com.pictet.adventurebook.validation.BookValidationRule;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Validates that a book has exactly one BEGIN section.
 */
@Component
public class SingleBeginningRule implements BookValidationRule {

    @Override
    public Optional<String> validate(Book book) {
        long beginCount = book.getSections().stream()
                .filter(s -> s.getType() == SectionType.BEGIN)
                .count();

        if (beginCount == 0) {
            return Optional.of("Book must have a BEGIN section");
        }

        if (beginCount > 1) {
            return Optional.of("Book must have exactly one BEGIN section, found " + beginCount);
        }

        return Optional.empty();
    }

    @Override
    public String getRuleName() {
        return "SingleBeginning";
    }
}
