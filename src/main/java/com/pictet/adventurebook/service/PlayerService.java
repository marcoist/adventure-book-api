package com.pictet.adventurebook.service;

import com.pictet.adventurebook.dto.CreatePlayerDTO;
import com.pictet.adventurebook.dto.PlayerDTO;
import com.pictet.adventurebook.exception.PlayerNotFoundException;
import com.pictet.adventurebook.exception.UsernameAlreadyExistsException;
import com.pictet.adventurebook.model.Player;
import com.pictet.adventurebook.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Transactional
    public PlayerDTO createPlayer(CreatePlayerDTO createDTO) {
        if (playerRepository.existsByUsername(createDTO.username())) {
            throw new UsernameAlreadyExistsException(createDTO.username());
        }

        Player player = Player.builder()
                .username(createDTO.username())
                .build();

        Player savedPlayer = playerRepository.save(player);
        log.info("Created new player: {}", savedPlayer.getUsername());

        return PlayerDTO.from(savedPlayer);
    }

    @Transactional(readOnly = true)
    public PlayerDTO getPlayerById(Long id) {
        Player player = findPlayerOrThrow(id);
        return PlayerDTO.from(player);
    }

    @Transactional(readOnly = true)
    public List<PlayerDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(PlayerDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Player findPlayerOrThrow(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id));
    }
}
