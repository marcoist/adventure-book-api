package com.pictet.adventurebook.service;

import com.pictet.adventurebook.dto.ConsequenceDTO;
import com.pictet.adventurebook.dto.GameStateDTO;
import com.pictet.adventurebook.dto.SessionSummaryDTO;
import com.pictet.adventurebook.exception.*;
import com.pictet.adventurebook.model.*;
import com.pictet.adventurebook.repository.GameSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final GameSessionRepository sessionRepository;
    private final BookService bookService;
    private final PlayerService playerService;

    /**
     * Start a new game session for a player.
     */
    @Transactional
    public GameStateDTO startGame(Long playerId, Long bookId) {
        Player player = playerService.findPlayerOrThrow(playerId);
        Book book = bookService.findBookOrThrow(bookId);

        if (!book.getValid()) {
            throw new InvalidBookException("Cannot play an invalid book");
        }

        Section beginSection = book.getBeginSection();
        if (beginSection == null) {
            throw new InvalidBookException("Book has no beginning section");
        }

        GameSession session = GameSession.builder()
                .player(player)
                .book(book)
                .currentSectionId(beginSection.getSectionId())
                .healthPoints(GameSession.INITIAL_HEALTH)
                .status(SessionStatus.PLAYING)
                .build();

        GameSession savedSession = sessionRepository.save(session);
        log.info("Player '{}' started game for book '{}'", player.getUsername(), book.getTitle());

        return GameStateDTO.from(savedSession, beginSection);
    }

    /**
     * Get all sessions for a player.
     */
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getPlayerSessions(Long playerId) {
        playerService.findPlayerOrThrow(playerId);
        return sessionRepository.findByPlayerId(playerId).stream()
                .map(SessionSummaryDTO::from)
                .toList();
    }

    /**
     * Get a specific session.
     */
    @Transactional(readOnly = true)
    public GameStateDTO getSession(Long playerId, Long sessionId) {
        GameSession session = findSessionOrThrow(playerId, sessionId);
        Section currentSection = session.getBook().findSectionById(session.getCurrentSectionId());
        return GameStateDTO.from(session, currentSection);
    }

    /**
     * Make a choice in the current section.
     */
    @Transactional
    public GameStateDTO makeChoice(Long playerId, Long sessionId, int optionIndex) {
        GameSession session = findSessionOrThrow(playerId, sessionId);

        if (!session.isPlayable()) {
            throw new GameNotPlayableException(session.getStatus());
        }

        Section currentSection = session.getBook().findSectionById(session.getCurrentSectionId());
        if (currentSection == null) {
            throw new InvalidSectionException(session.getCurrentSectionId());
        }

        if (currentSection.isEnding()) {
            throw new InvalidChoiceException("Cannot make a choice on an ending section");
        }

        List<Option> options = currentSection.getOptions();
        if (optionIndex < 0 || optionIndex >= options.size()) {
            throw new InvalidChoiceException(
                    String.format("Invalid option index %d, valid range is 0-%d", optionIndex, options.size() - 1)
            );
        }

        Option chosenOption = options.get(optionIndex);
        Consequence consequence = chosenOption.getConsequence();

        // Apply consequence if present
        session.applyConsequence(consequence);

        // Move to next section
        Section nextSection = session.getBook().findSectionById(chosenOption.getGotoId());
        if (nextSection == null) {
            throw new InvalidSectionException(chosenOption.getGotoId());
        }

        session.setCurrentSectionId(nextSection.getSectionId());

        // Check if reached an ending
        if (nextSection.isEnding() && session.getStatus() == SessionStatus.PLAYING) {
            session.setStatus(SessionStatus.COMPLETED);
            log.info("Player completed book '{}' with {} health points",
                    session.getBook().getTitle(), session.getHealthPoints());
        }

        GameSession savedSession = sessionRepository.save(session);

        ConsequenceDTO consequenceDTO = ConsequenceDTO.from(consequence);
        return GameStateDTO.from(savedSession, nextSection, consequenceDTO);
    }

    /**
     * Pause a game session.
     */
    @Transactional
    public GameStateDTO pauseSession(Long playerId, Long sessionId) {
        GameSession session = findSessionOrThrow(playerId, sessionId);

        if (session.getStatus() != SessionStatus.PLAYING) {
            throw new GameNotPlayableException("Can only pause a PLAYING session");
        }

        session.setStatus(SessionStatus.PAUSED);
        GameSession savedSession = sessionRepository.save(session);
        Section currentSection = session.getBook().findSectionById(session.getCurrentSectionId());

        log.info("Session {} paused for player {}", sessionId, playerId);
        return GameStateDTO.from(savedSession, currentSection);
    }

    /**
     * Resume a paused game session.
     */
    @Transactional
    public GameStateDTO resumeSession(Long playerId, Long sessionId) {
        GameSession session = findSessionOrThrow(playerId, sessionId);

        if (session.getStatus() != SessionStatus.PAUSED) {
            throw new GameNotPlayableException("Can only resume a PAUSED session");
        }

        session.setStatus(SessionStatus.PLAYING);
        GameSession savedSession = sessionRepository.save(session);
        Section currentSection = session.getBook().findSectionById(session.getCurrentSectionId());

        log.info("Session {} resumed for player {}", sessionId, playerId);
        return GameStateDTO.from(savedSession, currentSection);
    }

    private GameSession findSessionOrThrow(Long playerId, Long sessionId) {
        return sessionRepository.findByIdAndPlayerId(sessionId, playerId)
                .orElseThrow(() -> new SessionNotFoundException(sessionId, playerId));
    }
}
