import { Article } from '@/types/article'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export interface ArticleStorageOptions {
  maxArticlesPerWord?: number
  enableCaching?: boolean
  cacheExpiryHours?: number
  storagePath?: string
}

export class ArticleStorage {
  private static instance: ArticleStorage
  private articles: Map<string, Article> = new Map()
  private wordArticles: Map<string, Article[]> = new Map()
  private options: ArticleStorageOptions
  private storagePath: string

  private constructor(options: ArticleStorageOptions = {}) {
    this.options = {
      maxArticlesPerWord: 5,
      enableCaching: true,
      cacheExpiryHours: 24,
      storagePath: './data/articles',
      ...options
    }
    
    this.storagePath = this.options.storagePath!
    
    // Ensure storage directory exists
    this.ensureStorageDirectory()
  }

  public static getInstance(options?: ArticleStorageOptions): ArticleStorage {
    if (!ArticleStorage.instance) {
      ArticleStorage.instance = new ArticleStorage(options)
    }
    return ArticleStorage.instance
  }

  /**
   * Ensure storage directory exists
   */
  private ensureStorageDirectory(): void {
    try {
      if (!existsSync(this.storagePath)) {
        mkdirSync(this.storagePath, { recursive: true })
        console.log(`Created storage directory: ${this.storagePath}`)
      }
    } catch (error) {
      console.warn('Failed to create storage directory:', error)
    }
  }

  /**
   * Store articles for a specific word
   */
  public async storeArticles(word: string, articles: Article[]): Promise<void> {
    const wordKey = word.toLowerCase()
    
    // Store individual articles into map (add or update)
    for (const article of articles) {
      this.articles.set(article.id, article)
    }
    
    // Append to existing word list instead of overwriting
    const existingForWord = this.wordArticles.get(wordKey) || []
    const combined = [...existingForWord]
    for (const a of articles) {
      const existsIdx = combined.findIndex(x => x.id === a.id)
      if (existsIdx >= 0) {
        combined[existsIdx] = a
      } else {
        combined.push(a)
      }
    }

    // Respect maxArticlesPerWord by trimming oldest items
    const maxPerWord = this.options.maxArticlesPerWord || 5
    const trimmed = combined
      .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    while (trimmed.length > maxPerWord) {
      const removed = trimmed.shift()
      if (removed) {
        // keep article in global map for historical browse across words if needed
        // but typically the per-word cap is enough; do not delete global map here
      }
    }

    // Update word-article mapping
    this.wordArticles.set(wordKey, trimmed)
    
    // Persist to file system
    await this.persistToFileSystem()
    
    // Persist to localStorage if available (client-side)
    this.persistToLocalStorage()
    
    console.log(`Stored ${articles.length} articles for word: ${word}`)
  }

  /**
   * Get all articles for a specific word
   */
  public async getArticlesForWord(word: string): Promise<Article[]> {
    const wordKey = word.toLowerCase()
    const articles = this.wordArticles.get(wordKey) || []
    
    if (articles.length === 0) {
      console.log(`No articles found for word: ${word}`)
    }
    
    return articles
  }

  /**
   * Get a specific article by ID
   */
  public async getArticleById(id: string): Promise<Article | null> {
    const article = this.articles.get(id)
    
    if (!article) {
      console.log(`Article not found with ID: ${id}`)
    }
    
    return article || null
  }

  /**
   * Get articles by category
   */
  public async getArticlesByCategory(category: string): Promise<Article[]> {
    const allArticles = Array.from(this.articles.values())
    return allArticles.filter(article => article.category === category)
  }

  /**
   * Get articles by tag
   */
  public async getArticlesByTag(tag: string): Promise<Article[]> {
    const allArticles = Array.from(this.articles.values())
    return allArticles.filter(article => 
      article.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    )
  }

  /**
   * Search articles by title, content, or tags
   */
  public async searchArticles(query: string): Promise<Article[]> {
    const allArticles = Array.from(this.articles.values())
    const queryLower = query.toLowerCase()
    
    return allArticles.filter(article => 
      article.title.toLowerCase().includes(queryLower) ||
      article.excerpt.toLowerCase().includes(queryLower) ||
      article.tags.some(tag => tag.toLowerCase().includes(queryLower))
    )
  }

  /**
   * Get recent articles
   */
  public async getRecentArticles(limit: number = 10): Promise<Article[]> {
    try {
      const allArticles = Array.from(this.articles.values())
      
      // Sort by publishedAt (newest first) and return limited results
      const sortedArticles = allArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      
      return sortedArticles.slice(0, limit)
    } catch (error) {
      console.error('Failed to get recent articles:', error)
      return []
    }
  }

  /**
   * Get popular articles
   */
  public async getPopularArticles(limit: number = 10): Promise<Article[]> {
    try {
      const allArticles = Array.from(this.articles.values())
      
      // Sort by viewCount (highest first) and return limited results
      const sortedArticles = allArticles.sort((a, b) => 
        (b.viewCount || 0) - (a.viewCount || 0)
      )
      
      return sortedArticles.slice(0, limit)
    } catch (error) {
      console.error('Failed to get popular articles:', error)
      return []
    }
  }

  /**
   * Update article view count
   */
  public async incrementViewCount(articleId: string): Promise<void> {
    const article = this.articles.get(articleId)
    if (article) {
      article.viewCount++
      article.updatedAt = new Date().toISOString()
      await this.persistToFileSystem()
      this.persistToLocalStorage()
    }
  }

  /**
   * Update article like count
   */
  public async incrementLikeCount(articleId: string): Promise<void> {
    const article = this.articles.get(articleId)
    if (article) {
      article.likeCount++
      article.updatedAt = new Date().toISOString()
      await this.persistToFileSystem()
      this.persistToLocalStorage()
    }
  }

  /**
   * Check if articles exist for a word
   */
  public async hasArticlesForWord(word: string): Promise<boolean> {
    const wordKey = word.toLowerCase()
    return this.wordArticles.has(wordKey)
  }

  /**
   * Get article statistics
   */
  public async getArticleStats(): Promise<{
    totalArticles: number
    totalWords: number
    categories: Record<string, number>
    totalViews: number
    totalLikes: number
  }> {
    const allArticles = Array.from(this.articles.values())
    const categories: Record<string, number> = {}
    
    for (const article of allArticles) {
      categories[article.category] = (categories[article.category] || 0) + 1
    }
    
    return {
      totalArticles: allArticles.length,
      totalWords: this.wordArticles.size,
      categories,
      totalViews: allArticles.reduce((sum, article) => sum + article.viewCount, 0),
      totalLikes: allArticles.reduce((sum, article) => sum + article.likeCount, 0)
    }
  }

  /**
   * Clear all articles (useful for testing or reset)
   */
  public async clearAllArticles(): Promise<void> {
    this.articles.clear()
    this.wordArticles.clear()
    await this.persistToFileSystem()
    this.clearLocalStorage()
    console.log('All articles cleared')
  }

  /**
   * Get articles for a specific date range
   */
  public async getArticlesByDateRange(startDate: Date, endDate: Date): Promise<Article[]> {
    const allArticles = Array.from(this.articles.values())
    
    return allArticles.filter(article => {
      const articleDate = new Date(article.publishedAt)
      return articleDate >= startDate && articleDate <= endDate
    })
  }

  /**
   * Get articles by difficulty level
   */
  public async getArticlesByDifficulty(difficulty: string): Promise<Article[]> {
    const allArticles = Array.from(this.articles.values())
    return allArticles.filter(article => article.difficulty === difficulty)
  }

  /**
   * Get articles by quality score range
   */
  public async getArticlesByQualityScore(minScore: number, maxScore: number): Promise<Article[]> {
    const allArticles = Array.from(this.articles.values())
    return allArticles.filter(article => 
      article.qualityScore >= minScore && article.qualityScore <= maxScore
    )
  }

  /**
   * Get all articles sorted by publishedAt desc (optionally paginated)
   */
  public async getAllArticlesSorted(limit: number = 100, offset: number = 0): Promise<Article[]> {
    try {
      const allArticles = Array.from(this.articles.values())
      const sorted = allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      if (offset <= 0 && limit >= sorted.length) return sorted
      return sorted.slice(offset, offset + limit)
    } catch (error) {
      console.error('Failed to get all articles sorted:', error)
      return []
    }
  }

  /**
   * Persist articles to file system
   */
  private async persistToFileSystem(): Promise<void> {
    try {
      const storageData = {
        articles: Array.from(this.articles.entries()),
        wordArticles: Array.from(this.wordArticles.entries()),
        timestamp: Date.now()
      }
      
      const filePath = join(this.storagePath, 'articles.json')
      writeFileSync(filePath, JSON.stringify(storageData, null, 2))
      console.log(`Articles persisted to file system: ${filePath}`)
    } catch (error) {
      console.warn('Failed to persist articles to file system:', error)
    }
  }

  /**
   * Load articles from file system
   */
  private async loadFromFileSystem(): Promise<void> {
    try {
      const filePath = join(this.storagePath, 'articles.json')
      
      if (existsSync(filePath)) {
        const fileContent = readFileSync(filePath, 'utf-8')
        const parsed = JSON.parse(fileContent)
        const now = Date.now()
        const expiryTime = this.options.cacheExpiryHours! * 60 * 60 * 1000
        
        // Check if cache is still valid
        if (now - parsed.timestamp < expiryTime) {
          this.articles = new Map(parsed.articles)
          this.wordArticles = new Map(parsed.wordArticles)
          console.log(`Articles loaded from file system: ${this.articles.size} articles`)
        } else {
          console.log('Articles cache expired, clearing...')
          await this.clearAllArticles()
        }
      }
    } catch (error) {
      console.warn('Failed to load articles from file system:', error)
      // Don't clear articles on load error, just continue with empty state
    }
  }

  /**
   * Persist articles to localStorage (client-side only)
   */
  private persistToLocalStorage(): void {
    if (typeof window !== 'undefined' && this.options.enableCaching) {
      try {
        const storageData = {
          articles: Array.from(this.articles.entries()),
          wordArticles: Array.from(this.wordArticles.entries()),
          timestamp: Date.now()
        }
        localStorage.setItem('wordle-articles', JSON.stringify(storageData))
      } catch (error) {
        console.warn('Failed to persist articles to localStorage:', error)
      }
    }
  }

  /**
   * Load articles from localStorage (client-side only)
   */
  private loadFromLocalStorage(): void {
    if (typeof window !== 'undefined' && this.options.enableCaching) {
      try {
        const storageData = localStorage.getItem('wordle-articles')
        if (storageData) {
          const parsed = JSON.parse(storageData)
          const now = Date.now()
          const expiryTime = this.options.cacheExpiryHours! * 60 * 60 * 1000
          
          // Check if cache is still valid
          if (now - parsed.timestamp < expiryTime) {
            this.articles = new Map(parsed.articles)
            this.wordArticles = new Map(parsed.wordArticles)
            console.log('Articles loaded from localStorage cache')
          } else {
            console.log('Articles localStorage cache expired, clearing...')
            this.clearLocalStorage()
          }
        }
      } catch (error) {
        console.warn('Failed to load articles from localStorage:', error)
        this.clearLocalStorage()
      }
    }
  }

  /**
   * Clear localStorage
   */
  private clearLocalStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('wordle-articles')
      } catch (error) {
        console.warn('Failed to clear localStorage:', error)
      }
    }
  }

  /**
   * Initialize storage (load from file system and localStorage if available)
   */
  public async initialize(): Promise<void> {
    // First try to load from file system (server-side persistence)
    await this.loadFromFileSystem()
    
    // Then try to load from localStorage (client-side cache)
    this.loadFromLocalStorage()
    
    console.log(`Article storage initialized with ${this.articles.size} articles`)
  }
} 