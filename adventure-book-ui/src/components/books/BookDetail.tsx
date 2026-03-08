import { useQuery } from '@tanstack/react-query';
import { Book, CheckCircle, XCircle, Layers, Play, Edit } from 'lucide-react';
import { api } from '../../api/client';
import { Button, DifficultyBadge, Badge, Modal } from '../common';
import type { BookSummary } from '../../types';

interface BookDetailProps {
  book: BookSummary;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (bookId: number) => void;
  onEdit?: (bookId: number) => void;
}

export function BookDetail({ book, isOpen, onClose, onPlay, onEdit }: BookDetailProps) {
  const { data: detail, isLoading } = useQuery({
    queryKey: ['book', book.id],
    queryFn: () => api.getBook(book.id),
    enabled: isOpen,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={book.title} size="lg">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-slate-700 rounded-lg" />
          <div className="h-4 bg-slate-700 rounded w-1/2" />
          <div className="h-4 bg-slate-700 rounded w-3/4" />
        </div>
      ) : detail ? (
        <div>
          {/* Cover and Info */}
          <div className="flex gap-6 mb-6">
            <div className="flex-shrink-0 w-32 h-44 bg-gradient-to-br from-amber-900/30 to-slate-900 rounded-lg flex items-center justify-center">
              <Book className="w-12 h-12 text-amber-500/50" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">{detail.title}</h2>
              <p className="text-slate-400 mb-4">by {detail.author}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Difficulty:</span>
                  <DifficultyBadge difficulty={detail.difficulty} />
                </div>

                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">
                    {detail.sectionCount} sections
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {detail.valid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Valid book</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-400">Invalid book</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          {detail.categories.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {detail.categories.map((category) => (
                  <Badge key={category} variant="default">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button
              onClick={() => onPlay(detail.id)}
              disabled={!detail.valid}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
            {onEdit && (
              <Button variant="secondary" onClick={() => onEdit(detail.id)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {!detail.valid && (
            <p className="text-sm text-red-400 mt-3 text-center">
              This book cannot be played because it has validation errors.
            </p>
          )}
        </div>
      ) : (
        <p className="text-slate-400">Failed to load book details</p>
      )}
    </Modal>
  );
}
