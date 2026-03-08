package com.pictet.adventurebook.config;

import com.pictet.adventurebook.model.Book;
import com.pictet.adventurebook.service.BookService;
import com.pictet.adventurebook.validation.ValidationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Loads sample book JSON files on application startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final BookJsonParser bookJsonParser;
    private final BookService bookService;

    @Override
    public void run(String... args) throws Exception {
        log.info("Loading sample adventure books...");

        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:books/*.json");

        log.info("Found {} book files to load", resources.length);

        int loaded = 0;
        int failed = 0;

        for (Resource resource : resources) {
            try (InputStream inputStream = resource.getInputStream()) {
                String filename = resource.getFilename();
                Book book = bookJsonParser.parse(inputStream, filename);

                // Add some default categories based on content/filename
                book.setCategories(inferCategories(book, filename));

                Book savedBook = bookService.saveAndValidate(book);
                log.info("Loaded book: '{}' by {} [valid={}]",
                        savedBook.getTitle(),
                        savedBook.getAuthor(),
                        savedBook.getValid());
                loaded++;
            } catch (Exception e) {
                log.error("Failed to load book from {}: {}", resource.getFilename(), e.getMessage());
                failed++;
            }
        }

        log.info("Book loading complete: {} loaded, {} failed", loaded, failed);
    }

    private Set<String> inferCategories(Book book, String filename) {
        Set<String> categories = new HashSet<>();
        categories.add("ADVENTURE");

        String titleLower = book.getTitle().toLowerCase();
        String filenameLower = filename != null ? filename.toLowerCase() : "";

        if (titleLower.contains("dragon") || titleLower.contains("quest")) {
            categories.add("FANTASY");
        }
        if (titleLower.contains("prison") || titleLower.contains("escape")) {
            categories.add("THRILLER");
        }
        if (titleLower.contains("crystal") || titleLower.contains("cavern")) {
            categories.add("FANTASY");
        }
        if (titleLower.contains("pirate") || titleLower.contains("sea")) {
            categories.add("PIRATES");
        }
        if (filenameLower.contains("horror") || titleLower.contains("horror")) {
            categories.add("HORROR");
        }

        return categories;
    }
}
