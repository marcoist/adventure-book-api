package com.pictet.adventurebook.validation;

import com.pictet.adventurebook.model.*;
import com.pictet.adventurebook.validation.rules.HasEndingRule;
import com.pictet.adventurebook.validation.rules.NonEndingSectionsHaveOptionsRule;
import com.pictet.adventurebook.validation.rules.SingleBeginningRule;
import com.pictet.adventurebook.validation.rules.ValidReferencesRule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class BookValidatorTest {

    private BookValidator validator;

    @BeforeEach
    void setUp() {
        validator = new BookValidator(List.of(
                new SingleBeginningRule(),
                new HasEndingRule(),
                new ValidReferencesRule(),
                new NonEndingSectionsHaveOptionsRule()
        ));
    }

    @Test
    void shouldValidateCorrectBook() {
        Book book = createValidBook();

        ValidationResult result = validator.validate(book);

        assertTrue(result.valid());
        assertTrue(result.errors().isEmpty());
    }

    @Test
    void shouldRejectBookWithNoBeginning() {
        Book book = createValidBook();
        book.getSections().get(0).setType(SectionType.NODE);

        ValidationResult result = validator.validate(book);

        assertFalse(result.valid());
        assertTrue(result.errors().stream()
                .anyMatch(e -> e.contains("BEGIN")));
    }

    @Test
    void shouldRejectBookWithMultipleBeginnings() {
        Book book = createValidBook();
        Section extraBegin = Section.builder()
                .sectionId(99)
                .text("Another beginning")
                .type(SectionType.BEGIN)
                .build();
        extraBegin.addOption(Option.builder()
                .description("Go somewhere")
                .gotoId(2)
                .build());
        book.addSection(extraBegin);

        ValidationResult result = validator.validate(book);

        assertFalse(result.valid());
        assertTrue(result.errors().stream()
                .anyMatch(e -> e.contains("exactly one BEGIN")));
    }

    @Test
    void shouldRejectBookWithNoEnding() {
        Book book = createValidBook();
        book.getSections().get(1).setType(SectionType.NODE);
        book.getSections().get(1).addOption(Option.builder()
                .description("Loop back")
                .gotoId(1)
                .build());

        ValidationResult result = validator.validate(book);

        assertFalse(result.valid());
        assertTrue(result.errors().stream()
                .anyMatch(e -> e.contains("END")));
    }

    @Test
    void shouldRejectBookWithInvalidReference() {
        Book book = createValidBook();
        book.getSections().get(0).getOptions().get(0).setGotoId(999);

        ValidationResult result = validator.validate(book);

        assertFalse(result.valid());
        assertTrue(result.errors().stream()
                .anyMatch(e -> e.contains("non-existent section")));
    }

    @Test
    void shouldRejectNonEndingSectionWithoutOptions() {
        Book book = createValidBook();
        Section noOptions = Section.builder()
                .sectionId(3)
                .text("Stuck here")
                .type(SectionType.NODE)
                .build();
        book.addSection(noOptions);
        book.getSections().get(0).getOptions().get(0).setGotoId(3);

        ValidationResult result = validator.validate(book);

        assertFalse(result.valid());
        assertTrue(result.errors().stream()
                .anyMatch(e -> e.contains("no options")));
    }

    private Book createValidBook() {
        Book book = Book.builder()
                .title("Test Book")
                .author("Test Author")
                .difficulty(Difficulty.EASY)
                .build();

        // BEGIN section
        Section begin = Section.builder()
                .sectionId(1)
                .text("The beginning")
                .type(SectionType.BEGIN)
                .build();
        begin.addOption(Option.builder()
                .description("Go to end")
                .gotoId(2)
                .build());
        book.addSection(begin);

        // END section
        Section end = Section.builder()
                .sectionId(2)
                .text("The end")
                .type(SectionType.END)
                .build();
        book.addSection(end);

        return book;
    }
}
