package com.pictet.adventurebook.service;

import com.pictet.adventurebook.model.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GameServiceTest {

    @Test
    void shouldApplyLoseHealthConsequence() {
        GameSession session = GameSession.builder()
                .healthPoints(10)
                .status(SessionStatus.PLAYING)
                .build();

        Consequence consequence = Consequence.builder()
                .type(ConsequenceType.LOSE_HEALTH)
                .value(3)
                .text("You got hurt")
                .build();

        session.applyConsequence(consequence);

        assertEquals(7, session.getHealthPoints());
        assertEquals(SessionStatus.PLAYING, session.getStatus());
    }

    @Test
    void shouldApplyGainHealthConsequence() {
        GameSession session = GameSession.builder()
                .healthPoints(5)
                .status(SessionStatus.PLAYING)
                .build();

        Consequence consequence = Consequence.builder()
                .type(ConsequenceType.GAIN_HEALTH)
                .value(3)
                .text("You healed")
                .build();

        session.applyConsequence(consequence);

        assertEquals(8, session.getHealthPoints());
    }

    @Test
    void shouldCapHealthAtMaximum() {
        GameSession session = GameSession.builder()
                .healthPoints(8)
                .status(SessionStatus.PLAYING)
                .build();

        Consequence consequence = Consequence.builder()
                .type(ConsequenceType.GAIN_HEALTH)
                .value(5)
                .text("Full heal")
                .build();

        session.applyConsequence(consequence);

        assertEquals(10, session.getHealthPoints());
    }

    @Test
    void shouldSetDeadStatusWhenHealthReachesZero() {
        GameSession session = GameSession.builder()
                .healthPoints(3)
                .status(SessionStatus.PLAYING)
                .build();

        Consequence consequence = Consequence.builder()
                .type(ConsequenceType.LOSE_HEALTH)
                .value(5)
                .text("Fatal blow")
                .build();

        session.applyConsequence(consequence);

        assertEquals(0, session.getHealthPoints());
        assertEquals(SessionStatus.DEAD, session.getStatus());
    }

    @Test
    void shouldNotGoNegativeHealth() {
        GameSession session = GameSession.builder()
                .healthPoints(2)
                .status(SessionStatus.PLAYING)
                .build();

        Consequence consequence = Consequence.builder()
                .type(ConsequenceType.LOSE_HEALTH)
                .value(10)
                .text("Massive damage")
                .build();

        session.applyConsequence(consequence);

        assertEquals(0, session.getHealthPoints());
    }

    @Test
    void shouldHandleNullConsequence() {
        GameSession session = GameSession.builder()
                .healthPoints(10)
                .status(SessionStatus.PLAYING)
                .build();

        session.applyConsequence(null);

        assertEquals(10, session.getHealthPoints());
        assertEquals(SessionStatus.PLAYING, session.getStatus());
    }
}
