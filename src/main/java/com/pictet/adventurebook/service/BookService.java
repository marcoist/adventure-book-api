package com.pictet.adventurebook.service;

import com.pictet.adventurebook.dto.BookCreateDTO;
import com.pictet.adventurebook.dto.BookDetailDTO;
import com.pictet.adventurebook.dto.BookSummaryDTO;
import com.pictet.adventurebook.dto.CategoryUpdateDTO;
import com.pictet.adventurebook.exception.BookNotFoundException;
import com.pictet.adventurebook.exception.InvalidBookException;
import com.pictet.adventurebook.model.*;
import com.pictet.adventurebook.repository.BookRepository;
import com.pictet.adventurebook.validation.BookValidator;
import com.pictet.adventurebook.validation.ValidationResult;

import java.util.HashSet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    private final BookRepository bookRepository;
    private final BookValidator bookValidator;

    /**
     * Get all books with optional filtering.
     */
    @Transactional(readOnly = true)
    public List<BookSummaryDTO> findAll(String title, String author, String category, Difficulty difficulty) {
        List<Book> books;

        if (title == null && author == null && category == null && difficulty == null) {
            books = bookRepository.findAll();
        } else {
            books = bookRepository.searchBooks(title, author, difficulty, category);
        }

        return books.stream()
                .map(BookSummaryDTO::from)
                .toList();
    }

    /**
     * Get book details by ID.
     */
    @Transactional(readOnly = true)
    public BookDetailDTO getBookById(Long id) {
        Book book = findBookOrThrow(id);
        return BookDetailDTO.from(book);
    }

    /**
     * Get book entity by ID (for internal use).
     */
    @Transactional(readOnly = true)
    public Book findBookOrThrow(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    /**
     * Update categories for a book.
     */
    @Transactional
    public BookDetailDTO updateCategories(Long id, CategoryUpdateDTO update) {
        Book book = findBookOrThrow(id);

        if (update.add() != null) {
            update.add().stream()
                    .map(String::toUpperCase)
                    .forEach(book.getCategories()::add);
        }

        if (update.remove() != null) {
            update.remove().stream()
                    .map(String::toUpperCase)
                    .forEach(book.getCategories()::remove);
        }

        Book savedBook = bookRepository.save(book);
        log.info("Updated categories for book '{}': {}", book.getTitle(), book.getCategories());

        return BookDetailDTO.from(savedBook);
    }

    /**
     * Save a book and validate it.
     */
    @Transactional
    public Book saveAndValidate(Book book) {
        bookValidator.validateAndUpdate(book);
        return bookRepository.save(book);
    }

    /**
     * Objective 6: Create a new book from DTO.
     */
    @Transactional
    public BookDetailDTO createBook(BookCreateDTO createDTO) {
        Book book = Book.builder()
                .title(createDTO.title())
                .author(createDTO.author())
                .difficulty(createDTO.difficulty())
                .categories(createDTO.categories() != null
                        ? new HashSet<>(createDTO.categories())
                        : new HashSet<>())
                .build();

        // Convert sections
        for (BookCreateDTO.SectionCreateDTO sectionDTO : createDTO.sections()) {
            Section section = Section.builder()
                    .sectionId(sectionDTO.id())
                    .text(sectionDTO.text())
                    .type(SectionType.valueOf(sectionDTO.type().toUpperCase()))
                    .build();

            // Convert options
            if (sectionDTO.options() != null) {
                for (BookCreateDTO.OptionCreateDTO optionDTO : sectionDTO.options()) {
                    Option option = Option.builder()
                            .description(optionDTO.description())
                            .gotoId(optionDTO.gotoId())
                            .build();

                    // Convert consequence if present
                    if (optionDTO.consequence() != null) {
                        option.setConsequence(Consequence.builder()
                                .type(ConsequenceType.valueOf(optionDTO.consequence().type().toUpperCase()))
                                .value(optionDTO.consequence().value())
                                .text(optionDTO.consequence().text())
                                .build());
                    }

                    section.addOption(option);
                }
            }

            book.addSection(section);
        }

        // Validate the book
        ValidationResult validationResult = bookValidator.validate(book);
        book.setValid(validationResult.valid());

        if (!validationResult.valid()) {
            log.warn("Book '{}' created with validation errors: {}", book.getTitle(), validationResult.errors());
        }

        Book savedBook = bookRepository.save(book);
        log.info("Created new book: '{}' by {} [valid={}]", savedBook.getTitle(), savedBook.getAuthor(), savedBook.getValid());

        return BookDetailDTO.from(savedBook);
    }
}
