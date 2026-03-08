package com.pictet.adventurebook.repository;

import com.pictet.adventurebook.model.GameSession;
import com.pictet.adventurebook.model.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {

    List<GameSession> findByPlayerId(Long playerId);

    List<GameSession> findByPlayerIdAndStatus(Long playerId, SessionStatus status);

    Optional<GameSession> findByIdAndPlayerId(Long id, Long playerId);

    Optional<GameSession> findByPlayerIdAndBookIdAndStatus(Long playerId, Long bookId, SessionStatus status);
}
