import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus } from 'lucide-react';
import { api } from '../api/client';
import { Button } from '../components/common';
import { BookList, BookDetail } from '../components/books';
import type { BookSummary, Player } from '../types';

interface BooksPageProps {
  player: Player | null;
}

export function BooksPage({ player }: BooksPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedBook, setSelectedBook] = useState<BookSummary | null>(null);

  const startGameMutation = useMutation({
    mutationFn: (bookId: number) => api.startGame(player!.id, bookId),
    onSuccess: (gameState) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', player!.id] });
      navigate(`/play/${player!.id}/${gameState.sessionId}`);
    },
  });

  const handlePlay = (bookId: number) => {
    if (!player) {
      navigate('/');
      return;
    }
    startGameMutation.mutate(bookId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Books</h1>
            <p className="text-sm text-slate-400">
              Browse and start your next adventure
            </p>
          </div>
        </div>
        <Button onClick={() => navigate('/editor')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Book
        </Button>
      </div>

      {/* Player Warning */}
      {!player && (
        <div className="mb-6 bg-amber-900/30 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-200">
            Select a player on the home page to start playing books.
          </p>
        </div>
      )}

      {/* Book List */}
      <BookList onSelectBook={setSelectedBook} />

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetail
          book={selectedBook}
          isOpen={true}
          onClose={() => setSelectedBook(null)}
          onPlay={handlePlay}
          onEdit={(id) => navigate(`/editor/${id}`)}
        />
      )}
    </div>
  );
}
