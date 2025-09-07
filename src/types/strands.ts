// NYT Strands Game Types
export interface StrandsPuzzle {
  id: string
  date: string
  grid: string[][]
  words: StrandsWord[]
  theme: string
  spangram: string
  spangramPosition: SpangramPosition
  difficulty: 'easy' | 'medium' | 'hard'
  hints: StrandsHint[]
  source: 'nyt' | 'sample'
  isReal: boolean
}

export interface StrandsWord {
  word: string
  positions: GridPosition[]
  category: string
  found: boolean
}

export interface GridPosition {
  row: number
  col: number
}

export interface SpangramPosition {
  start: GridPosition
  end: GridPosition
  direction: 'horizontal' | 'vertical'
}

export interface StrandsHint {
  level: number
  title: string
  description: string
  type: 'theme' | 'spangram' | 'word' | 'pattern'
  content: string
  color: string
  example?: string
  tip?: string
}

export interface StrandsGameState {
  puzzle: StrandsPuzzle
  foundWords: string[]
  selectedCells: GridPosition[]
  gameStatus: 'playing' | 'won' | 'lost'
  hintsUsed: number
  maxHints: number
}

export interface StrandsApiResponse {
  success: boolean
  data?: StrandsPuzzle
  error?: string
  message?: string
}

// NYT Strands Real Data Interface
export interface NYTStrandsData {
  id: number
  print_date: string
  grid: string[][]
  words: Array<{
    word: string
    positions: GridPosition[]
  }>
  theme: string
  spangram: string
  spangram_position: SpangramPosition
}

export interface StrandsEducationalContent {
  themeAnalysis: {
    theme: string
    description: string
    relatedConcepts: string[]
    difficulty: 'easy' | 'medium' | 'hard'
  }
  wordAnalysis: {
    totalWords: number
    foundWords: number
    remainingWords: number
    averageLength: number
    longestWord: string
    shortestWord: string
  }
  learningChallenges: Array<{
    challenge: string
    difficulty: 'easy' | 'medium' | 'hard'
    type: 'word_finding' | 'pattern_recognition' | 'theme_identification'
    examples: string[]
  }>
  dailyQuestions: Array<{
    question: string
    answer: string
    difficulty: 'easy' | 'medium' | 'hard'
    category: 'theme' | 'word' | 'pattern'
  }>
  relatedTopics: Array<{
    topic: string
    description: string
    examples: string[]
  }>
}
