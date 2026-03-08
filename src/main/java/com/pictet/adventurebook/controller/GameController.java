package com.pictet.adventurebook.controller;

import com.pictet.adventurebook.dto.GameStateDTO;
import com.pictet.adventurebook.dto.SessionSummaryDTO;
import com.pictet.adventurebook.dto.StartGameDTO;
import com.pictet.adventurebook.service.GameService;
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
@RequestMapping("/api/players/{playerId}/sessions")
@RequiredArgsConstructor
@Tag(name = "Game Sessions", description = "Gameplay and session management endpoints")
public class GameController {

    private final GameService gameService;

    /**
     * Objective 3 & 5: Start a new game session.
     */
    @PostMapping
    @Operation(summary = "Start new game", description = "Start a new game session for a player with a specific book")
    public ResponseEntity<GameStateDTO> startGame(
            @Parameter(description = "Player ID")
            @PathVariable Long playerId,

            @Valid @RequestBody StartGameDTO startDTO
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(gameService.startGame(playerId, startDTO.bookId()));
    }

    /**
     * Objective 5: Get all sessions for a player.
     */
    @GetMapping
    @Operation(summary = "List sessions", description = "Get all game sessions for a player")
    public ResponseEntity<List<SessionSummaryDTO>> getPlayerSessions(
            @Parameter(description = "Player ID")
            @PathVariable Long playerId
    ) {
        return ResponseEntity.ok(gameService.getPlayerSessions(playerId));
    }

    /**
     * Objective 5: Get a specific session.
     */
    @GetMapping("/{sessionId}")
    @Operation(summary = "Get session", description = "Get current state of a game session")
    public ResponseEntity<GameStateDTO> getSession(
            @Parameter(description = "Player ID")
            @PathVariable Long playerId,

            @Parameter(description = "Session ID")
            @PathVariable Long sessionId
    ) {
        return ResponseEntity.ok(gameService.getSession(playerId, sessionId));
    }

    /**
     * Objective 3 & 4: Make a choice in the current section.
     */
    @PostMapping("/{sessionId}/choose")
    @Operation(summary = "Make choice", description = "Make a choice in the current section, applying any consequences")
    public ResponseEntity<GameStateDTO> makeChoice(
            @Parameter(description = "Player ID")
            @PathVariable Long playerId,

            @Parameter(description = "Session ID")
            @PathVariable Long sessionId,

            @Parameter(description = "Index of the option to choose (0-based)")
            @RequestParam int optionIndex
    ) {
        return ResponseEntity.ok(gameService.makeChoice(playerId, sessionId, optionIndex));
    }

    /**
     * Objective 5: Pause a session.
     */
    @PutMapping("/{sessionId}/pause")
    @Operation(summary = "Pause session", description = "Pause an active game session")
    public ResponseEntity<GameStateDTO> pauseSession(
            @Parameter(description = "Player ID")
            @PathVariable Long playerId,

            @Parameter(description = "Session ID")
            @PathVariable Long sessionId
    ) {
        return ResponseEntity.ok(gameService.pauseSession(playerId, sessionId));
    }

    /**
     * Objective 5: Resume a paused session.
     */
    @PutMapping("/{sessionId}/resume")
    @Operation(summary = "Resume session", description = "Resume a paused game session")
    public ResponseEntity<GameStateDTO> resumeSession(
            @Parameter(description = "Player ID")
            @PathVariable Long playerId,

            @Parameter(description = "Session ID")
            @PathVariable Long sessionId
    ) {
        return ResponseEntity.ok(gameService.resumeSession(playerId, sessionId));
    }
}
