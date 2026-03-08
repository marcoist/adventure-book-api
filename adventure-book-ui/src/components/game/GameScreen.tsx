import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pause, Play, Home, RotateCcw, Trophy, Skull } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Button, HealthBar, Card } from '../common';
import { StorySection } from './StorySection';
import { ChoiceButton } from './ChoiceButton';
import { ConsequenceAlert } from './ConsequenceAlert';
import type { Consequence } from '../../types';

interface GameScreenProps {
  playerId: number;
  sessionId: number;
}

export function GameScreen({ playerId, sessionId }: GameScreenProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [lastConsequence, setLastConsequence] = useState<Consequence | null>(null);
  const [healthAnimation, setHealthAnimation] = useState<'damage' | 'heal' | null>(null);

  const { data: gameState, isLoading, error } = useQuery({
    queryKey: ['session', playerId, sessionId],
    queryFn: () => api.getSession(playerId, sessionId),
  });

  const makeChoiceMutation = useMutation({
    mutationFn: (optionIndex: number) =>
      api.makeChoice(playerId, sessionId, optionIndex),
    onSuccess: (data) => {
      queryClient.setQueryData(['session', playerId, sessionId], data);
      if (data.lastConsequence) {
        setLastConsequence(data.lastConsequence);
        setHealthAnimation(
          data.lastConsequence.type === 'LOSE_HEALTH' ? 'damage' : 'heal'
        );
      }
    },
  });

  const pauseMutation = useMutation({
    mutationFn: () => api.pauseSession(playerId, sessionId),
    onSuccess: (data) => {
      queryClient.setQueryData(['session', playerId, sessionId], data);
    },
  });

  const resumeMutation = useMutation({
    mutationFn: () => api.resumeSession(playerId, sessionId),
    onSuccess: (data) => {
      queryClient.setQueryData(['session', playerId, sessionId], data);
    },
  });

  useEffect(() => {
    if (healthAnimation) {
      const timer = setTimeout(() => setHealthAnimation(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [healthAnimation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-400">Loading game...</div>
      </div>
    );
  }

  if (error || !gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-400">Failed to load game session</p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  const isGameOver = gameState.status === 'DEAD' || gameState.status === 'COMPLETED';
  const isPaused = gameState.status === 'PAUSED';
  const isPlaying = gameState.status === 'PLAYING';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{gameState.bookTitle}</h1>
          <p className="text-sm text-slate-400">
            Section {gameState.section.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4" />
          </Button>
          {isPlaying && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => pauseMutation.mutate()}
              loading={pauseMutation.isPending}
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
          )}
          {isPaused && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => resumeMutation.mutate()}
              loading={resumeMutation.isPending}
            >
              <Play className="w-4 h-4 mr-1" />
              Resume
            </Button>
          )}
        </div>
      </div>

      {/* Health Bar */}
      <Card className="mb-6">
        <HealthBar
          current={gameState.healthPoints}
          max={10}
          animate={healthAnimation}
        />
      </Card>

      {/* Game Over / Victory Screen */}
      {isGameOver && (
        <Card className="mb-6 text-center py-8">
          {gameState.status === 'COMPLETED' ? (
            <>
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-amber-400 mb-2">Victory!</h2>
              <p className="text-slate-300 mb-6">
                Congratulations! You have completed this adventure.
              </p>
            </>
          ) : (
            <>
              <Skull className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-400 mb-2">Game Over</h2>
              <p className="text-slate-300 mb-6">
                Your adventure has come to an end...
              </p>
            </>
          )}
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => navigate('/sessions')}>
              View Sessions
            </Button>
            <Button onClick={() => navigate('/books')}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </Card>
      )}

      {/* Paused Overlay */}
      {isPaused && (
        <Card className="mb-6 text-center py-8 border-amber-500/50">
          <Pause className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-amber-400 mb-2">Game Paused</h2>
          <p className="text-slate-400 mb-4">
            Click Resume to continue your adventure
          </p>
        </Card>
      )}

      {/* Story Content */}
      {!isPaused && (
        <>
          <Card className="mb-6">
            <StorySection section={gameState.section} />
          </Card>

          {/* Choices */}
          {isPlaying && gameState.section.options.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                What do you do?
              </h3>
              {gameState.section.options.map((option) => (
                <ChoiceButton
                  key={option.index}
                  option={option}
                  onClick={() => makeChoiceMutation.mutate(option.index)}
                  disabled={makeChoiceMutation.isPending}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Consequence Alert */}
      {lastConsequence && (
        <ConsequenceAlert
          consequence={lastConsequence}
          onDismiss={() => setLastConsequence(null)}
        />
      )}
    </div>
  );
}
