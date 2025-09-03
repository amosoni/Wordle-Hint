// Connections Game Types
export interface ConnectionsPuzzle {
  id: string
  date: string
  words: string[]
  categories: ConnectionsCategory[]
  difficulty: 'yellow' | 'green' | 'blue' | 'purple'
  hints: ConnectionsHint[]
  source: string
  isReal: boolean
}

export interface ConnectionsCategory {
  name: string
  words: string[]
  color: 'yellow' | 'green' | 'blue' | 'purple'
  difficulty: number
  description: string
  explanation?: string
}

export interface ConnectionsHint {
  level: number
  title: string
  description: string
  type: 'category' | 'word' | 'pattern' | 'direct'
  content: string
  color: string
  example?: string
  tip?: string
}

export interface ConnectionsGameState {
  status: 'playing' | 'won' | 'lost'
  selectedWords: string[]
  completedCategories: ConnectionsCategory[]
  mistakes: number
  maxMistakes: number
}

export interface ConnectionsStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  perfectGames: number
  averageMistakes: number
}

export interface ConnectionsBoardProps {
  words: string[]
  selectedWords: string[]
  onWordSelect: (word: string) => void
  gameState: ConnectionsGameState
}

export interface ConnectionsWordTileProps {
  word: string
  isSelected: boolean
  isCompleted: boolean
  category?: ConnectionsCategory
  onClick: () => void
}

export interface ConnectionsHintPanelProps {
  hints: ConnectionsHint[]
  onHintSelect: (level: number) => void
  selectedHint: number | null
  disabled: boolean
}

export interface ConnectionsApiResponse {
  success: boolean
  data: ConnectionsPuzzle
  timestamp: string
}

export interface ConnectionsHintRequest {
  puzzleId: string
  hintLevel: number
  selectedWords: string[]
}

export interface ConnectionsHintResponse {
  hint: ConnectionsHint
  remainingHints: number
}

export interface ConnectionsEducationalContent {
  wordAnalysis: {
    commonWords: string[]
    rareWords: string[]
    wordPatterns: string[]
    difficultyScore: number
  }
  learningChallenges: {
    challenge: string
    difficulty: 'easy' | 'medium' | 'hard'
    type: string
    examples: string[]
  }[]
  dailyQuestions: {
    question: string
    answer: string
    difficulty: 'easy' | 'medium' | 'hard'
    category: string
  }[]
  relatedTopics: {
    topic: string
    description: string
    examples: string[]
  }[]
}

export type ConnectionsHintLevel = 1 | 2 | 3 | 4