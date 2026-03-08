package com.pictet.adventurebook.validation.rules;

import com.pictet.adventurebook.model.Book;
import com.pictet.adventurebook.model.SectionType;
import com.pictet.adventurebook.validation.BookValidationRule;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Validates that a book has at least one END section.
 */
@Component
public class HasEndingRule implements BookValidationRule {

    @Override
    public Optional<String> validate(Book book) {
        boolean hasEnding = book.getSections().stream()
                .anyMatch(s -> s.getType() == SectionType.END);

        if (!hasEnding) {
            return Optional.of("Book must have at least one END section");
        }

        return Optional.empty();
    }

    @Override
    public String getRuleName() {
        return "HasEnding";
    }
}
