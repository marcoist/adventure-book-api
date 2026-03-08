import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter } from 'lucide-react';
import { api } from '../../api/client';
import { BookCard } from './BookCard';
import { Button } from '../common';
import type { BookFilters, BookSummary, Difficulty } from '../../types';

interface BookListProps {
  onSelectBook: (book: BookSummary) => void;
}

export function BookList({ onSelectBook }: BookListProps) {
  const [filters, setFilters] = useState<BookFilters>({});
  const [titleSearch, setTitleSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books', filters],
    queryFn: () => api.getBooks(filters),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      title: titleSearch || undefined,
      author: authorSearch || undefined,
      category: categorySearch || undefined,
      difficulty: filters.difficulty,
    });
  };

  const handleDifficultyFilter = (difficulty: Difficulty | undefined) => {
    setFilters((prev) => ({ ...prev, difficulty }));
  };

  const clearFilters = () => {
    setFilters({});
    setTitleSearch('');
    setAuthorSearch('');
    setCategorySearch('');
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load books</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <Button
            type="button"
            variant={showFilters ? 'primary' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <form onSubmit={handleSearch} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-200">Filters</h4>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-amber-400 hover:text-amber-300"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Title</label>
                <input
                  type="text"
                  value={titleSearch}
                  onChange={(e) => setTitleSearch(e.target.value)}
                  placeholder="Search title..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Author</label>
                <input
                  type="text"
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(e.target.value)}
                  placeholder="Search author..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Category</label>
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Search category..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() =>
                        handleDifficultyFilter(
                          filters.difficulty === diff ? undefined : diff
                        )
                      }
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 ${
                        filters.difficulty === diff
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {diff.charAt(0) + diff.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit">
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Book Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4 animate-pulse"
            >
              <div className="h-32 bg-slate-700 rounded-lg mb-4" />
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : books && books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => onSelectBook(book)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">No books found</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-amber-400 hover:text-amber-300"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
