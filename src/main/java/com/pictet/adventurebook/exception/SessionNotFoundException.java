package com.pictet.adventurebook.exception;

public class SessionNotFoundException extends RuntimeException {

    public SessionNotFoundException(Long sessionId, Long playerId) {
        super(String.format("Session %d not found for player %d", sessionId, playerId));
    }
}
