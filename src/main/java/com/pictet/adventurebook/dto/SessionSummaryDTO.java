package com.pictet.adventurebook.dto;

import com.pictet.adventurebook.model.GameSession;
import com.pictet.adventurebook.model.SessionStatus;

import java.time.LocalDateTime;

public record SessionSummaryDTO(
        Long id,
        Long bookId,
        String bookTitle,
        int healthPoints,
        SessionStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SessionSummaryDTO from(GameSession session) {
        return new SessionSummaryDTO(
                session.getId(),
                session.getBook().getId(),
                session.getBook().getTitle(),
                session.getHealthPoints(),
                session.getStatus(),
                session.getCreatedAt(),
                session.getUpdatedAt()
        );
    }
}
