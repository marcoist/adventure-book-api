import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/common';
import { SessionList } from '../components/player';
import type { Player } from '../types';

interface SessionsPageProps {
  player: Player | null;
}

export function SessionsPage({ player }: SessionsPageProps) {
  const navigate = useNavigate();

  if (!player) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Sessions</h1>
          <p className="text-sm text-slate-400">
            Manage and continue your adventures
          </p>
        </div>
      </div>

      {/* Session List */}
      <SessionList playerId={player.id} />
    </div>
  );
}
