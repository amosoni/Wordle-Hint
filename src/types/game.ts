export interface Game {
  id: string
  name: string
  title: string
  description: string
  category: string
  subCategories: string[]
  playCount: number
  rating: number
  voteCount: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  tags: string[]
  imageUrl: string
  gameUrl: string
  isActive: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  achievements: Achievement[]
  highScores: HighScore[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: string
}

export interface HighScore {
  id: string
  playerName: string
  score: number
  time: number
  date: string
  rank: number
}

export interface GameCategory {
  id: string
  name: string
  icon: string
  description: string
  gameCount: number
  isActive: boolean
}

export interface GameSearchParams {
  category?: string
  difficulty?: string
  search?: string
  featured?: boolean
  sortBy?: 'name' | 'rating' | 'playCount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
} 