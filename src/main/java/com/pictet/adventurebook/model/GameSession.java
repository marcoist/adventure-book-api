package com.pictet.adventurebook.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "game_sessions")
public class GameSession {

    public static final int INITIAL_HEALTH = 10;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private Integer currentSectionId;

    @Column(nullable = false)
    @Builder.Default
    private Integer healthPoints = INITIAL_HEALTH;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SessionStatus status = SessionStatus.PLAYING;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void applyConsequence(Consequence consequence) {
        if (consequence == null) {
            return;
        }

        switch (consequence.getType()) {
            case LOSE_HEALTH -> {
                healthPoints = Math.max(0, healthPoints - consequence.getValue());
                if (healthPoints <= 0) {
                    status = SessionStatus.DEAD;
                }
            }
            case GAIN_HEALTH -> healthPoints = Math.min(INITIAL_HEALTH, healthPoints + consequence.getValue());
        }
    }

    public boolean isPlayable() {
        return status == SessionStatus.PLAYING;
    }
}
