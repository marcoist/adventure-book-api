// Enums
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type SessionStatus = 'PLAYING' | 'PAUSED' | 'COMPLETED' | 'DEAD';
export type SectionType = 'BEGIN' | 'NODE' | 'END';
export type ConsequenceType = 'LOSE_HEALTH' | 'GAIN_HEALTH';

// Book DTOs
export interface BookSummary {
  id: number;
  title: string;
  author: string;
  difficulty: Difficulty;
  categories: string[];
}

export interface BookDetail {
  id: number;
  title: string;
  author: string;
  difficulty: Difficulty;
  categories: string[];
  valid: boolean;
  sectionCount: number;
}

// Section & Option DTOs
export interface Consequence {
  type: ConsequenceType;
  value: number;
  text: string | null;
}

export interface Option {
  index: number;
  description: string;
  hasConsequence: boolean;
}

export interface Section {
  id: number;
  text: string;
  type: SectionType;
  options: Option[];
}

// Game DTOs
export interface GameState {
  sessionId: number;
  bookId: number;
  bookTitle: string;
  section: Section;
  healthPoints: number;
  status: SessionStatus;
  lastConsequence: Consequence | null;
}

export interface SessionSummary {
  id: number;
  bookId: number;
  bookTitle: string;
  healthPoints: number;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

// Player DTOs
export interface Player {
  id: number;
  username: string;
  createdAt: string;
  activeSessions: number;
}

// Create DTOs
export interface CreatePlayer {
  username: string;
}

export interface StartGame {
  bookId: number;
}

export interface CategoryUpdate {
  add?: string[];
  remove?: string[];
}

// Book Creation DTOs
export interface ConsequenceCreate {
  type: string;
  value: number;
  text?: string;
}

export interface OptionCreate {
  description: string;
  gotoId: number;
  consequence?: ConsequenceCreate;
}

export interface SectionCreate {
  id: number;
  text: string;
  type: string;
  options?: OptionCreate[];
}

export interface BookCreate {
  title: string;
  author: string;
  difficulty: Difficulty;
  categories?: string[];
  sections: SectionCreate[];
}

// API Error Response
export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}

// Book filter params
export interface BookFilters {
  title?: string;
  author?: string;
  category?: string;
  difficulty?: Difficulty;
}
