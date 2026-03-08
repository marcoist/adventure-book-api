import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Save, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, CardHeader, CardTitle } from '../components/common';
import { BookEditor } from '../components/books';
import { api } from '../api/client';
import type { ApiError } from '../types';

export function EditorPage() {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const queryClient = useQueryClient();
  const [createdBookId, setCreatedBookId] = useState<number | null>(null);
  const [categories, setCategories] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isEditMode = !!bookId;

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => api.getBook(Number(bookId)),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (book) {
      setCategories(book.categories?.join(', ') || '');
    }
  }, [book]);

  const updateCategoriesMutation = useMutation({
    mutationFn: (update: { add: string[]; remove: string[] }) =>
      api.updateBookCategories(Number(bookId), update),
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (err: ApiError) => {
      setError(err.message || 'Failed to update categories');
      setSuccess(false);
    },
  });

  const handleSaveCategories = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const newCategories = new Set(
      categories
        .split(',')
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c.length > 0)
    );
    const oldCategories = new Set(book?.categories?.map((c) => c.toUpperCase()) || []);

    // Calculate what to add and remove
    const toAdd = [...newCategories].filter((c) => !oldCategories.has(c));
    const toRemove = [...oldCategories].filter((c) => !newCategories.has(c));

    updateCategoriesMutation.mutate({ add: toAdd, remove: toRemove });
  };

  // Create mode success screen
  if (createdBookId) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card className="py-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Book Created Successfully!
          </h2>
          <p className="text-slate-400 mb-6">
            Your adventure book has been created and is ready to play.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => setCreatedBookId(null)}>
              Create Another
            </Button>
            <Button onClick={() => navigate('/books')}>
              Browse Books
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Edit mode
  if (isEditMode) {
    if (isLoading) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/books')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Edit Book</h1>
              <p className="text-sm text-slate-400">Loading...</p>
            </div>
          </div>
        </div>
      );
    }

    if (!book) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card className="py-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-100 mb-2">Book Not Found</h2>
            <p className="text-slate-400 mb-4">The book you're trying to edit doesn't exist.</p>
            <Button onClick={() => navigate('/books')}>Back to Books</Button>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/books')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Edit Book</h1>
            <p className="text-sm text-slate-400">
              Editing: {book.title}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSaveCategories} className="space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300">Categories updated successfully!</p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={book.title}
                  disabled
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-slate-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={book.author}
                  disabled
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-slate-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Difficulty
                </label>
                <input
                  type="text"
                  value={book.difficulty}
                  disabled
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-slate-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Categories (comma-separated)
                </label>
                <input
                  type="text"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="fantasy, adventure, mystery"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => navigate('/books')}>
              Cancel
            </Button>
            <Button type="submit" loading={updateCategoriesMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              Save Categories
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Create mode
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Create Book</h1>
          <p className="text-sm text-slate-400">
            Design your own choose-your-own-adventure story
          </p>
        </div>
      </div>

      {/* Editor */}
      <BookEditor onSuccess={(id) => setCreatedBookId(id)} />
    </div>
  );
}
