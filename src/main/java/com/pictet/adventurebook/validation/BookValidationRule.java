package com.pictet.adventurebook.validation;

import com.pictet.adventurebook.model.Book;

import java.util.Optional;

/**
 * Interface for book validation rules.
 * Follows the Open/Closed Principle: add new rules by creating new implementations,
 * without modifying existing code.
 */
public interface BookValidationRule {

    /**
     * Validates a book against this rule.
     *
     * @param book the book to validate
     * @return Optional containing error message if validation fails, empty if passes
     */
    Optional<String> validate(Book book);

    /**
     * @return the name of this rule for logging/debugging purposes
     */
    String getRuleName();
}
