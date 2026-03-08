import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Plus, Gamepad2 } from 'lucide-react';
import { api } from '../../api/client';
import { Button, Card, Modal } from '../common';
import type { Player, ApiError } from '../../types';

interface PlayerSelectProps {
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
}

export function PlayerSelect({ selectedPlayer, onSelectPlayer }: PlayerSelectProps) {
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: players, isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: api.getPlayers,
  });

  const createMutation = useMutation({
    mutationFn: (username: string) => api.createPlayer({ username }),
    onSuccess: (player) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      onSelectPlayer(player);
      setShowModal(false);
      setNewUsername('');
      setError(null);
    },
    onError: (err: ApiError) => {
      setError(err.message || 'Failed to create player');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      createMutation.mutate(newUsername.trim());
    }
  };

  return (
    <>
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              {selectedPlayer ? (
                <>
                  <p className="text-slate-400 text-sm">Playing as</p>
                  <p className="text-xl font-semibold text-slate-100">
                    {selectedPlayer.username}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-slate-400 text-sm">No player selected</p>
                  <p className="text-slate-300">Choose or create a player to continue</p>
                </>
              )}
            </div>
          </div>
          <Button variant="secondary" onClick={() => setShowModal(true)}>
            {selectedPlayer ? 'Switch Player' : 'Select Player'}
          </Button>
        </div>

        {selectedPlayer && (
          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span>{selectedPlayer.activeSessions} active sessions</span>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setError(null);
        }}
        title="Select Player"
        size="md"
      >
        {/* Create New Player */}
        <form onSubmit={handleCreate} className="mb-6">
          <h4 className="text-sm font-medium text-slate-400 mb-2">Create New Player</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                setError(null);
              }}
              placeholder="Enter username"
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button type="submit" loading={createMutation.isPending}>
              <Plus className="w-4 h-4 mr-1" />
              Create
            </Button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </form>

        {/* Existing Players */}
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-2">
            Or Select Existing Player
          </h4>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-700 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : players && players.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => {
                    onSelectPlayer(player);
                    setShowModal(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    selectedPlayer?.id === player.id
                      ? 'bg-amber-500/20 border-amber-500'
                      : 'bg-slate-700/50 border-slate-600 hover:border-amber-500/50'
                  }`}
                >
                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-slate-100">{player.username}</p>
                    <p className="text-xs text-slate-400">
                      {player.activeSessions} active sessions
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">
              No players yet. Create one above!
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
