package com.pictet.adventurebook.dto;

import com.pictet.adventurebook.model.GameSession;
import com.pictet.adventurebook.model.Section;
import com.pictet.adventurebook.model.SessionStatus;

public record GameStateDTO(
        Long sessionId,
        Long bookId,
        String bookTitle,
        SectionDTO section,
        int healthPoints,
        SessionStatus status,
        ConsequenceDTO lastConsequence
) {
    public static GameStateDTO from(GameSession session, Section section, ConsequenceDTO consequence) {
        return new GameStateDTO(
                session.getId(),
                session.getBook().getId(),
                session.getBook().getTitle(),
                SectionDTO.from(section),
                session.getHealthPoints(),
                session.getStatus(),
                consequence
        );
    }

    public static GameStateDTO from(GameSession session, Section section) {
        return from(session, section, null);
    }
}
