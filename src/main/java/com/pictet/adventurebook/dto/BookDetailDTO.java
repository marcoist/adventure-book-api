package com.pictet.adventurebook.dto;

import com.pictet.adventurebook.model.Book;
import com.pictet.adventurebook.model.Difficulty;

import java.util.Set;

public record BookDetailDTO(
        Long id,
        String title,
        String author,
        Difficulty difficulty,
        Set<String> categories,
        boolean valid,
        int sectionCount
) {
    public static BookDetailDTO from(Book book) {
        return new BookDetailDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getDifficulty(),
                book.getCategories(),
                book.getValid(),
                book.getSections().size()
        );
    }
}
