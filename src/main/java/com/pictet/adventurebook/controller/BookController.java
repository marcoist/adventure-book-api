package com.pictet.adventurebook.controller;

import com.pictet.adventurebook.dto.BookCreateDTO;
import com.pictet.adventurebook.dto.BookDetailDTO;
import com.pictet.adventurebook.dto.BookSummaryDTO;
import com.pictet.adventurebook.dto.CategoryUpdateDTO;
import com.pictet.adventurebook.model.Difficulty;
import com.pictet.adventurebook.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Book management endpoints")
public class BookController {

    private final BookService bookService;

    /**
     * Objective 1: List all books with optional filtering.
     */
    @GetMapping
    @Operation(summary = "List all books", description = "Get all books with optional filtering by title, author, category, or difficulty")
    public ResponseEntity<List<BookSummaryDTO>> getAllBooks(
            @Parameter(description = "Filter by title (partial match)")
            @RequestParam(required = false) String title,

            @Parameter(description = "Filter by author (partial match)")
            @RequestParam(required = false) String author,

            @Parameter(description = "Filter by category")
            @RequestParam(required = false) String category,

            @Parameter(description = "Filter by difficulty")
            @RequestParam(required = false) Difficulty difficulty
    ) {
        return ResponseEntity.ok(bookService.findAll(title, author, category, difficulty));
    }

    /**
     * Objective 2: Get book details.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get book details", description = "Get detailed information about a specific book")
    public ResponseEntity<BookDetailDTO> getBookById(
            @Parameter(description = "Book ID")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    /**
     * Objective 2: Update book categories.
     */
    @PatchMapping("/{id}/categories")
    @Operation(summary = "Update book categories", description = "Add or remove categories from a book")
    public ResponseEntity<BookDetailDTO> updateCategories(
            @Parameter(description = "Book ID")
            @PathVariable Long id,

            @Valid @RequestBody CategoryUpdateDTO update
    ) {
        return ResponseEntity.ok(bookService.updateCategories(id, update));
    }

    /**
     * Objective 6: Create a new book.
     */
    @PostMapping
    @Operation(summary = "Create new book", description = "Add a new adventure book to the collection")
    public ResponseEntity<BookDetailDTO> createBook(
            @Valid @RequestBody BookCreateDTO createDTO
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookService.createBook(createDTO));
    }
}
