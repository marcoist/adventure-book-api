import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Play, Eye, Clock, Heart } from 'lucide-react';
import { api } from '../../api/client';
import { Button, Card, StatusBadge } from '../common';
import type { SessionSummary } from '../../types';

interface SessionListProps {
  playerId: number;
}

export function SessionList({ playerId }: SessionListProps) {
  const navigate = useNavigate();

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions', playerId],
    queryFn: () => api.getPlayerSessions(playerId),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-slate-800 border border-slate-700 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-8">
        <p className="text-red-400">Failed to load sessions</p>
      </Card>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-slate-400 mb-4">No game sessions yet</p>
        <Button onClick={() => navigate('/books')}>Browse Books</Button>
      </Card>
    );
  }

  // Sort sessions: active first, then by updated date
  const sortedSessions = [...sessions].sort((a, b) => {
    const aActive = a.status === 'PLAYING' || a.status === 'PAUSED';
    const bActive = b.status === 'PLAYING' || b.status === 'PAUSED';
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-3">
      {sortedSessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          playerId={playerId}
          onView={() => navigate(`/play/${playerId}/${session.id}`)}
        />
      ))}
    </div>
  );
}

interface SessionCardProps {
  session: SessionSummary;
  playerId: number;
  onView: () => void;
}

function SessionCard({ session, onView }: SessionCardProps) {
  const isActive = session.status === 'PLAYING' || session.status === 'PAUSED';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card
      hover
      onClick={onView}
      className={isActive ? 'border-amber-500/30' : ''}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-slate-100 truncate">
              {session.bookTitle}
            </h3>
            <StatusBadge status={session.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-400" />
              <span>{session.healthPoints}/10</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(session.updatedAt)}</span>
            </div>
          </div>
        </div>
        <Button
          variant={isActive ? 'primary' : 'secondary'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
        >
          {isActive ? (
            <>
              <Play className="w-4 h-4 mr-1" />
              {session.status === 'PAUSED' ? 'Resume' : 'Continue'}
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1" />
              View
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
