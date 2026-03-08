import { Book } from 'lucide-react';
import { Card, DifficultyBadge, Badge } from '../common';
import type { BookSummary } from '../../types';

interface BookCardProps {
  book: BookSummary;
  onClick?: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <Card hover onClick={onClick} className="h-full">
      <div className="flex flex-col h-full">
        {/* Cover placeholder */}
        <div className="relative h-32 bg-gradient-to-br from-amber-900/30 to-slate-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          <Book className="w-12 h-12 text-amber-500/50" />
          <div className="absolute top-2 right-2">
            <DifficultyBadge difficulty={book.difficulty} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-100 mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-slate-400 mb-3">by {book.author}</p>

          {/* Categories */}
          {book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="default">
                  {category}
                </Badge>
              ))}
              {book.categories.length > 3 && (
                <Badge variant="default">+{book.categories.length - 3}</Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
