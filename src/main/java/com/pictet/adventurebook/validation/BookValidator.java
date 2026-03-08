package com.pictet.adventurebook.validation;

import com.pictet.adventurebook.model.Book;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Book validator that aggregates all validation rules.
 * Follows the Open/Closed Principle: new rules are automatically picked up
 * through Spring's dependency injection without modifying this class.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BookValidator {

    private final List<BookValidationRule> rules;

    /**
     * Validates a book against all registered rules.
     *
     * @param book the book to validate
     * @return ValidationResult with all errors found
     */
    public ValidationResult validate(Book book) {
        log.debug("Validating book '{}' with {} rules", book.getTitle(), rules.size());

        List<String> errors = rules.stream()
                .map(rule -> {
                    Optional<String> error = rule.validate(book);
                    error.ifPresent(e -> log.debug("Rule '{}' failed: {}", rule.getRuleName(), e));
                    return error;
                })
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();

        if (errors.isEmpty()) {
            log.debug("Book '{}' passed all validation rules", book.getTitle());
            return ValidationResult.success();
        }

        log.debug("Book '{}' failed validation with {} errors", book.getTitle(), errors.size());
        return ValidationResult.invalid(errors);
    }

    /**
     * Validates a book and updates its valid flag.
     *
     * @param book the book to validate and update
     * @return the validation result
     */
    public ValidationResult validateAndUpdate(Book book) {
        ValidationResult result = validate(book);
        book.setValid(result.valid());
        return result;
    }
}
