import { useParams, Navigate } from 'react-router-dom';
import { GameScreen } from '../components/game';

export function PlayPage() {
  const { playerId, sessionId } = useParams<{
    playerId: string;
    sessionId: string;
  }>();

  if (!playerId || !sessionId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="py-6">
      <GameScreen
        playerId={parseInt(playerId)}
        sessionId={parseInt(sessionId)}
      />
    </div>
  );
}
