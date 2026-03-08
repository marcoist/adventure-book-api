import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Plus, Trash2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { api } from '../../api/client';
import { Button, Card, CardHeader, CardTitle } from '../common';
import type { BookCreate, SectionCreate, OptionCreate, Difficulty, ApiError } from '../../types';

interface BookEditorProps {
  onSuccess?: (bookId: number) => void;
}

const initialSection: SectionCreate = {
  id: 1,
  text: '',
  type: 'BEGIN',
  options: [],
};

const initialOption: OptionCreate = {
  description: '',
  gotoId: 1,
};

export function BookEditor({ onSuccess }: BookEditorProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [categories, setCategories] = useState('');
  const [sections, setSections] = useState<SectionCreate[]>([{ ...initialSection }]);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (data: BookCreate) => api.createBook(data),
    onSuccess: (data) => {
      onSuccess?.(data.id);
    },
    onError: (err: ApiError) => {
      setError(err.message || 'Failed to create book');
    },
  });

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const addSection = () => {
    const maxId = Math.max(...sections.map((s) => s.id), 0);
    setSections([
      ...sections,
      { id: maxId + 1, text: '', type: 'NODE', options: [] },
    ]);
    setExpandedSections((prev) => new Set([...prev, sections.length]));
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
    setExpandedSections((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const updateSection = (index: number, updates: Partial<SectionCreate>) => {
    setSections(
      sections.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  };

  const addOption = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    updateSection(sectionIndex, {
      options: [...(section.options || []), { ...initialOption }],
    });
  };

  const removeOption = (sectionIndex: number, optionIndex: number) => {
    const section = sections[sectionIndex];
    updateSection(sectionIndex, {
      options: section.options?.filter((_, i) => i !== optionIndex),
    });
  };

  const updateOption = (
    sectionIndex: number,
    optionIndex: number,
    updates: Partial<OptionCreate>
  ) => {
    const section = sections[sectionIndex];
    updateSection(sectionIndex, {
      options: section.options?.map((o, i) =>
        i === optionIndex ? { ...o, ...updates } : o
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const bookData: BookCreate = {
      title,
      author,
      difficulty,
      categories: categories
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0),
      sections: sections.map((s) => ({
        ...s,
        options: s.type === 'END' ? undefined : s.options,
      })),
    };

    createMutation.mutate(bookData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Book Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Author *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Difficulty *
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
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

      {/* Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Sections</h3>
          <Button type="button" variant="secondary" size="sm" onClick={addSection}>
            <Plus className="w-4 h-4 mr-1" />
            Add Section
          </Button>
        </div>

        <div className="space-y-4">
          {sections.map((section, sIndex) => (
            <Card key={sIndex} padding="none">
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(sIndex)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-amber-500/20 text-amber-400 rounded-lg font-semibold text-sm">
                    {section.id}
                  </span>
                  <span className="text-slate-100">
                    {section.text.slice(0, 50) || 'Untitled section'}
                    {section.text.length > 50 && '...'}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      section.type === 'BEGIN'
                        ? 'bg-green-500/20 text-green-400'
                        : section.type === 'END'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-slate-600 text-slate-300'
                    }`}
                  >
                    {section.type}
                  </span>
                </div>
                {expandedSections.has(sIndex) ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Section Content */}
              {expandedSections.has(sIndex) && (
                <div className="p-4 pt-0 border-t border-slate-700 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Section ID *
                      </label>
                      <input
                        type="number"
                        value={section.id}
                        onChange={(e) =>
                          updateSection(sIndex, { id: parseInt(e.target.value) || 1 })
                        }
                        min={1}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Type *
                      </label>
                      <select
                        value={section.type}
                        onChange={(e) =>
                          updateSection(sIndex, { type: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="BEGIN">BEGIN</option>
                        <option value="NODE">NODE</option>
                        <option value="END">END</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Story Text *
                    </label>
                    <textarea
                      value={section.text}
                      onChange={(e) => updateSection(sIndex, { text: e.target.value })}
                      rows={4}
                      required
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Options */}
                  {section.type !== 'END' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-300">
                          Options
                        </label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addOption(sIndex)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {section.options?.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className="bg-slate-900/50 rounded-lg p-3 space-y-3"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 flex items-center justify-center bg-slate-700 text-slate-300 rounded text-xs font-medium">
                                {oIndex + 1}
                              </span>
                              <div className="flex-1 space-y-3">
                                <input
                                  type="text"
                                  value={option.description}
                                  onChange={(e) =>
                                    updateOption(sIndex, oIndex, {
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder="Option description"
                                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-xs text-slate-400 mb-1">
                                      Go to Section
                                    </label>
                                    <select
                                      value={option.gotoId}
                                      onChange={(e) =>
                                        updateOption(sIndex, oIndex, {
                                          gotoId: parseInt(e.target.value),
                                        })
                                      }
                                      className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                      {sections.map((s) => (
                                        <option key={s.id} value={s.id}>
                                          Section {s.id}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-slate-400 mb-1">
                                      Consequence
                                    </label>
                                    <select
                                      value={option.consequence?.type || ''}
                                      onChange={(e) =>
                                        updateOption(sIndex, oIndex, {
                                          consequence: e.target.value
                                            ? {
                                                type: e.target.value,
                                                value:
                                                  option.consequence?.value || 1,
                                              }
                                            : undefined,
                                        })
                                      }
                                      className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                      <option value="">None</option>
                                      <option value="LOSE_HEALTH">Lose Health</option>
                                      <option value="GAIN_HEALTH">Gain Health</option>
                                    </select>
                                  </div>
                                  {option.consequence && (
                                    <div>
                                      <label className="block text-xs text-slate-400 mb-1">
                                        Value
                                      </label>
                                      <input
                                        type="number"
                                        value={option.consequence.value}
                                        onChange={(e) =>
                                          updateOption(sIndex, oIndex, {
                                            consequence: {
                                              ...option.consequence!,
                                              value: parseInt(e.target.value) || 1,
                                            },
                                          })
                                        }
                                        min={1}
                                        max={10}
                                        className="w-full px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(sIndex, oIndex)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Remove Section */}
                  {sections.length > 1 && (
                    <div className="pt-3 border-t border-slate-700">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeSection(sIndex)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove Section
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" loading={createMutation.isPending} size="lg">
          Create Book
        </Button>
      </div>
    </form>
  );
}
