export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readingTime: string
  difficulty: string
  qualityScore: number
  word: string
  wordNumber: number
  publishedAt: string
  updatedAt: string
  status: 'draft' | 'published' | 'archived'
  seoTitle?: string
  seoDescription?: string
  featuredImage?: string
  author?: string
  viewCount: number
  likeCount: number
}

export interface ArticleGenerationRequest {
  word: string
  wordNumber: number
  date: string
  forceRegenerate?: boolean
}

export interface ArticleGenerationResult {
  success: boolean
  articles: Article[]
  message?: string
  error?: string
}

export interface WordleDailyData {
  word: string
  wordNumber: number
  date: string
  source: string
  isReal: boolean
}

export interface ArticleTemplate {
  title: string
  category: string
  difficulty: string
  readingTime: string
  contentGenerator: (word: string, wordData: WordleDailyData) => string
  tags: string[]
} 