import { useNavigate } from 'react-router-dom';
import { Book, Gamepad2, PenTool } from 'lucide-react';
import { Button, Card } from '../components/common';
import { PlayerSelect } from '../components/player';
import { SessionList } from '../components/player';
import type { Player } from '../types';

interface HomePageProps {
  player: Player | null;
  onSelectPlayer: (player: Player) => void;
}

export function HomePage({ player, onSelectPlayer }: HomePageProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          Adventure Book
        </h1>
        <p className="text-slate-400 text-lg">
          Choose your own adventure in an interactive story experience
        </p>
      </div>

      {/* Player Selection */}
      <PlayerSelect selectedPlayer={player} onSelectPlayer={onSelectPlayer} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card
          hover
          onClick={() => navigate('/books')}
          className="text-center py-6"
        >
          <Book className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-100 mb-1">Browse Books</h3>
          <p className="text-sm text-slate-400">
            Explore our collection of adventures
          </p>
        </Card>

        <Card
          hover
          onClick={() => player && navigate('/sessions')}
          className={`text-center py-6 ${!player ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Gamepad2 className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-100 mb-1">My Sessions</h3>
          <p className="text-sm text-slate-400">
            Continue your adventures
          </p>
        </Card>

        <Card
          hover
          onClick={() => navigate('/editor')}
          className="text-center py-6"
        >
          <PenTool className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-100 mb-1">Create Book</h3>
          <p className="text-sm text-slate-400">
            Write your own adventure
          </p>
        </Card>
      </div>

      {/* Active Sessions */}
      {player && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-100">
              Your Adventures
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/sessions')}
            >
              View All
            </Button>
          </div>
          <SessionList playerId={player.id} />
        </div>
      )}
    </div>
  );
}
