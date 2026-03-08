package com.pictet.adventurebook.exception;

import com.pictet.adventurebook.model.SessionStatus;

public class GameNotPlayableException extends RuntimeException {

    public GameNotPlayableException(SessionStatus status) {
        super("Game is not playable. Current status: " + status);
    }

    public GameNotPlayableException(String message) {
        super(message);
    }
}
