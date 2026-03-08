package com.pictet.adventurebook.dto;

import com.pictet.adventurebook.model.Player;

import java.time.LocalDateTime;

public record PlayerDTO(
        Long id,
        String username,
        LocalDateTime createdAt,
        int activeSessions
) {
    public static PlayerDTO from(Player player) {
        int activeSessions = (int) player.getSessions().stream()
                .filter(s -> s.getStatus() == com.pictet.adventurebook.model.SessionStatus.PLAYING ||
                             s.getStatus() == com.pictet.adventurebook.model.SessionStatus.PAUSED)
                .count();

        return new PlayerDTO(
                player.getId(),
                player.getUsername(),
                player.getCreatedAt(),
                activeSessions
        );
    }
}
