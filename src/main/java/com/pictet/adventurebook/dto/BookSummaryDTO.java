package com.pictet.adventurebook.dto;

import com.pictet.adventurebook.model.Book;
import com.pictet.adventurebook.model.Difficulty;

import java.util.Set;

public record BookSummaryDTO(
        Long id,
        String title,
        String author,
        Difficulty difficulty,
        Set<String> categories
) {
    public static BookSummaryDTO from(Book book) {
        return new BookSummaryDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDifficulty(),
                book.getCategories()
        );
    }
}
