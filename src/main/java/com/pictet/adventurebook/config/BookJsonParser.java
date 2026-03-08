package com.pictet.adventurebook.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pictet.adventurebook.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 * Parser for adventure book JSON files.
 * Single Responsibility: Only handles JSON parsing to domain objects.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BookJsonParser {

    private final ObjectMapper objectMapper;

    public Book parse(InputStream inputStream, String filename) throws Exception {
        JsonNode root = objectMapper.readTree(inputStream);

        Book book = Book.builder()
                .title(root.get("title").asText())
                .author(root.get("author").asText())
                .difficulty(parseDifficulty(root))
                .build();

        // Parse sections
        JsonNode sectionsNode = root.get("sections");
        if (sectionsNode != null && sectionsNode.isArray()) {
            for (JsonNode sectionNode : sectionsNode) {
                Section section = parseSection(sectionNode);
                book.addSection(section);
            }
        }

        log.debug("Parsed book '{}' with {} sections from {}", book.getTitle(), book.getSections().size(), filename);
        return book;
    }

    private Difficulty parseDifficulty(JsonNode root) {
        JsonNode difficultyNode = root.get("difficulty");
        if (difficultyNode != null && !difficultyNode.isNull()) {
            try {
                return Difficulty.valueOf(difficultyNode.asText().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Unknown difficulty '{}', defaulting to MEDIUM", difficultyNode.asText());
            }
        }
        return Difficulty.MEDIUM;
    }

    private Section parseSection(JsonNode sectionNode) {
        Section section = Section.builder()
                .sectionId(parseSectionId(sectionNode.get("id")))
                .text(sectionNode.get("text").asText())
                .type(parseSectionType(sectionNode.get("type")))
                .build();

        // Parse options
        JsonNode optionsNode = sectionNode.get("options");
        if (optionsNode != null && optionsNode.isArray()) {
            for (JsonNode optionNode : optionsNode) {
                Option option = parseOption(optionNode);
                section.addOption(option);
            }
        }

        return section;
    }

    private Integer parseSectionId(JsonNode idNode) {
        if (idNode.isInt()) {
            return idNode.asInt();
        }
        return Integer.parseInt(idNode.asText());
    }

    private SectionType parseSectionType(JsonNode typeNode) {
        if (typeNode != null && !typeNode.isNull()) {
            try {
                return SectionType.valueOf(typeNode.asText().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Unknown section type '{}', defaulting to NODE", typeNode.asText());
            }
        }
        return SectionType.NODE;
    }

    private Option parseOption(JsonNode optionNode) {
        Option option = Option.builder()
                .description(optionNode.get("description").asText())
                .gotoId(optionNode.get("gotoId").asInt())
                .build();

        // Parse consequence if present
        JsonNode consequenceNode = optionNode.get("consequence");
        if (consequenceNode != null && !consequenceNode.isNull()) {
            option.setConsequence(parseConsequence(consequenceNode));
        }

        return option;
    }

    private Consequence parseConsequence(JsonNode consequenceNode) {
        ConsequenceType type = ConsequenceType.valueOf(
                consequenceNode.get("type").asText().toUpperCase()
        );

        Integer value = parseConsequenceValue(consequenceNode.get("value"));
        String text = consequenceNode.has("text") ? consequenceNode.get("text").asText() : null;

        return Consequence.builder()
                .type(type)
                .value(value)
                .text(text)
                .build();
    }

    private Integer parseConsequenceValue(JsonNode valueNode) {
        if (valueNode.isInt()) {
            return valueNode.asInt();
        }
        return Integer.parseInt(valueNode.asText());
    }
}
