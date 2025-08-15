// Game Types
export interface GameState {
  status: 'playing' | 'won' | 'lost'
  targetWord: string
  guesses: string[]
  maxGuesses: number
}

export interface GameStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  guessDistribution: number[]
}

// Hint Types
export interface HintSystem {
  currentHint: string
  hintLevel: number
  requestHint: () => void
  resetHints: () => void
}

export type HintLevel = 1 | 2 | 3

// Component Props Types
export interface GameBoardProps {
  guesses: string[]
  currentGuess: string
  gameStatus: GameState['status']
}

export interface WordleTileProps {
  letter: string
  isCurrentRow: boolean
  isSubmitted: boolean
  position: number
  targetWord: string
}

export interface KeyboardProps {
  onKeyPress: (key: string) => void
  gameState: GameState
  currentGuess: string
}

export interface HintPanelProps {
  currentHint: string
  hintLevel: number
  onRequestHint: () => void
  disabled: boolean
}

export interface GameStatsProps {
  stats: GameStats
}

// Utility Types
export type TileStatus = 'correct' | 'present' | 'absent' | 'empty'

export type KeyStatus = 'correct' | 'present' | 'absent' | 'unused' | 'function'

// API Types
export interface WordListResponse {
  words: string[]
  total: number
  date: string
}

export interface HintRequest {
  targetWord: string
  guesses: string[]
  hintLevel: HintLevel
}

export interface HintResponse {
  hint: string
  hintLevel: HintLevel
  remainingHints: number
} 