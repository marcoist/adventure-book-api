package com.pictet.adventurebook.controller;

import com.pictet.adventurebook.dto.CreatePlayerDTO;
import com.pictet.adventurebook.dto.PlayerDTO;
import com.pictet.adventurebook.service.PlayerService;
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
@RequestMapping("/api/players")
@RequiredArgsConstructor
@Tag(name = "Players", description = "Player management endpoints")
public class PlayerController {

    private final PlayerService playerService;

    /**
     * Objective 5: Create a new player.
     */
    @PostMapping
    @Operation(summary = "Create player", description = "Create a new player with a unique username")
    public ResponseEntity<PlayerDTO> createPlayer(
            @Valid @RequestBody CreatePlayerDTO createDTO
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(playerService.createPlayer(createDTO));
    }

    /**
     * Objective 5: Get player by ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get player", description = "Get player information by ID")
    public ResponseEntity<PlayerDTO> getPlayer(
            @Parameter(description = "Player ID")
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(playerService.getPlayerById(id));
    }

    /**
     * List all players.
     */
    @GetMapping
    @Operation(summary = "List players", description = "Get all registered players")
    public ResponseEntity<List<PlayerDTO>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }
}
