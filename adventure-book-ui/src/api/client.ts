import type {
  BookSummary,
  BookDetail,
  BookFilters,
  BookCreate,
  CategoryUpdate,
  Player,
  CreatePlayer,
  GameState,
  SessionSummary,
  ApiError,
} from '../types';

const API_BASE = '/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        status: response.status,
        error: response.statusText,
        message: 'An error occurred',
        timestamp: new Date().toISOString(),
      }));
      throw error;
    }

    return response.json();
  }

  // Books
  async getBooks(filters?: BookFilters): Promise<BookSummary[]> {
    const params = new URLSearchParams();
    if (filters?.title) params.set('title', filters.title);
    if (filters?.author) params.set('author', filters.author);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.difficulty) params.set('difficulty', filters.difficulty);

    const query = params.toString();
    return this.request<BookSummary[]>(`/books${query ? `?${query}` : ''}`);
  }

  async getBook(id: number): Promise<BookDetail> {
    return this.request<BookDetail>(`/books/${id}`);
  }

  async createBook(data: BookCreate): Promise<BookDetail> {
    return this.request<BookDetail>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBookCategories(id: number, update: CategoryUpdate): Promise<BookDetail> {
    return this.request<BookDetail>(`/books/${id}/categories`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    });
  }

  // Players
  async getPlayers(): Promise<Player[]> {
    return this.request<Player[]>('/players');
  }

  async getPlayer(id: number): Promise<Player> {
    return this.request<Player>(`/players/${id}`);
  }

  async createPlayer(data: CreatePlayer): Promise<Player> {
    return this.request<Player>('/players', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Game Sessions
  async getPlayerSessions(playerId: number): Promise<SessionSummary[]> {
    return this.request<SessionSummary[]>(`/players/${playerId}/sessions`);
  }

  async getSession(playerId: number, sessionId: number): Promise<GameState> {
    return this.request<GameState>(`/players/${playerId}/sessions/${sessionId}`);
  }

  async startGame(playerId: number, bookId: number): Promise<GameState> {
    return this.request<GameState>(`/players/${playerId}/sessions`, {
      method: 'POST',
      body: JSON.stringify({ bookId }),
    });
  }

  async makeChoice(
    playerId: number,
    sessionId: number,
    optionIndex: number
  ): Promise<GameState> {
    return this.request<GameState>(
      `/players/${playerId}/sessions/${sessionId}/choose?optionIndex=${optionIndex}`,
      { method: 'POST' }
    );
  }

  async pauseSession(playerId: number, sessionId: number): Promise<GameState> {
    return this.request<GameState>(
      `/players/${playerId}/sessions/${sessionId}/pause`,
      { method: 'PUT' }
    );
  }

  async resumeSession(playerId: number, sessionId: number): Promise<GameState> {
    return this.request<GameState>(
      `/players/${playerId}/sessions/${sessionId}/resume`,
      { method: 'PUT' }
    );
  }
}

export const api = new ApiClient();
