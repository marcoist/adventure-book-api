import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Book, Home, Gamepad2, PenTool } from 'lucide-react';
import { HomePage, BooksPage, PlayPage, SessionsPage, EditorPage } from './pages';
import type { Player } from './types';

function App() {
  const location = useLocation();
  const [player, setPlayer] = useState<Player | null>(() => {
    const saved = localStorage.getItem('currentPlayer');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (player) {
      localStorage.setItem('currentPlayer', JSON.stringify(player));
    } else {
      localStorage.removeItem('currentPlayer');
    }
  }, [player]);

  const isPlayPage = location.pathname.startsWith('/play/');

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      {!isPlayPage && (
        <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <Link
                to="/"
                className="flex items-center gap-2 text-amber-400 font-semibold"
              >
                <Book className="w-5 h-5" />
                <span>Adventure Book</span>
              </Link>

              <div className="flex items-center gap-1">
                <NavLink to="/" icon={<Home className="w-4 h-4" />}>
                  Home
                </NavLink>
                <NavLink to="/books" icon={<Book className="w-4 h-4" />}>
                  Books
                </NavLink>
                {player && (
                  <NavLink to="/sessions" icon={<Gamepad2 className="w-4 h-4" />}>
                    Sessions
                  </NavLink>
                )}
                <NavLink to="/editor" icon={<PenTool className="w-4 h-4" />}>
                  Editor
                </NavLink>
              </div>

              {player && (
                <div className="text-sm text-slate-400">
                  Playing as{' '}
                  <span className="text-amber-400 font-medium">
                    {player.username}
                  </span>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`${isPlayPage ? '' : 'p-6'}`}>
        <Routes>
          <Route
            path="/"
            element={<HomePage player={player} onSelectPlayer={setPlayer} />}
          />
          <Route path="/books" element={<BooksPage player={player} />} />
          <Route path="/play/:playerId/:sessionId" element={<PlayPage />} />
          <Route path="/sessions" element={<SessionsPage player={player} />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:bookId" element={<EditorPage />} />
        </Routes>
      </main>
    </div>
  );
}

function NavLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-amber-500/20 text-amber-400'
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}

export default App;
