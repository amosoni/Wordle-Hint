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

  // Optional Upstash REST config (server-side env)
  private readonly upstashUrl = process.env.UPSTASH_REDIS_REST_URL || ''
  private readonly upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN || ''
  private readonly redisKey = 'wordle:articles:v1'

  // Optional Cloudflare KV REST config
  private readonly cfAccountId = process.env.CF_ACCOUNT_ID || ''
  private readonly cfNamespaceId = process.env.CF_KV_NAMESPACE_ID || ''
  private readonly cfApiToken = process.env.CF_API_TOKEN || ''
  private readonly cfKvKey = 'wordle:articles:v1'

  private constructor(options: ArticleStorageOptions = {}) {
    this.options = {
      maxArticlesPerWord: 5,
      enableCaching: true,
      cacheExpiryHours: 24,
      storagePath: './data/articles',
      ...options
    }
    
    this.storagePath = this.options.storagePath!
    
    // Ensure storage directory exists (for local/dev fallback)
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
      }
    }

    // Update word-article mapping
    this.wordArticles.set(wordKey, trimmed)
    
    // Persist to external KV (Cloudflare preferred, then Upstash), else file system
    const persisted = await this.persistToCloudflareKV().catch(() => false)
      || await this.persistToUpstash().catch(() => false)
    if (!persisted) {
      await this.persistToFileSystem()
    }
    
    // Persist to localStorage if available (client-side)
    this.persistToLocalStorage()
    
    console.log(`Stored ${articles.length} articles for word: ${word}`)
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
      totalViews: allArticles.reduce((sum, article) => sum + (article.viewCount || 0), 0),
      totalLikes: allArticles.reduce((sum, article) => sum + (article.likeCount || 0), 0)
    }
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
   * Get all articles for a specific word
   */
  public async getArticlesForWord(word: string): Promise<Article[]> {
    const wordKey = word.toLowerCase()
    return this.wordArticles.get(wordKey) || []
  }

  /**
   * Get article by id
   */
  public async getArticleById(id: string): Promise<Article | null> {
    return this.articles.get(id) || null
  }

  /**
   * Get articles by category
   */
  public async getArticlesByCategory(category: string): Promise<Article[]> {
    const all = Array.from(this.articles.values())
    if (category === 'all') return all
    return all.filter(a => a.category === category)
  }

  /**
   * Text search in title/excerpt/tags
   */
  public async searchArticles(query: string): Promise<Article[]> {
    const q = query.toLowerCase()
    const all = Array.from(this.articles.values())
    return all.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  /**
   * Counters
   */
  public async incrementViewCount(articleId: string): Promise<void> {
    const a = this.articles.get(articleId)
    if (a) {
      a.viewCount = (a.viewCount || 0) + 1
      a.updatedAt = new Date().toISOString()
      await this.persistToFileSystem()
      this.persistToLocalStorage()
    }
  }

  public async incrementLikeCount(articleId: string): Promise<void> {
    const a = this.articles.get(articleId)
    if (a) {
      a.likeCount = (a.likeCount || 0) + 1
      a.updatedAt = new Date().toISOString()
      await this.persistToFileSystem()
      this.persistToLocalStorage()
    }
  }

  /**
   * Persist to Cloudflare KV (if configured)
   */
  private async persistToCloudflareKV(): Promise<boolean> {
    if (!this.cfAccountId || !this.cfNamespaceId || !this.cfApiToken) return false
    try {
      const storageData = {
        articles: Array.from(this.articles.entries()),
        wordArticles: Array.from(this.wordArticles.entries()),
        timestamp: Date.now()
      }
      const url = `https://api.cloudflare.com/client/v4/accounts/${this.cfAccountId}/storage/kv/namespaces/${this.cfNamespaceId}/values/${encodeURIComponent(this.cfKvKey)}`
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.cfApiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(storageData)
      })
      return res.ok
    } catch (e) {
      console.warn('Failed to persist to CF KV:', e)
      return false
    }
  }

  /**
   * Load from Cloudflare KV (if configured)
   */
  private async loadFromCloudflareKV(): Promise<boolean> {
    if (!this.cfAccountId || !this.cfNamespaceId || !this.cfApiToken) return false
    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${this.cfAccountId}/storage/kv/namespaces/${this.cfNamespaceId}/values/${encodeURIComponent(this.cfKvKey)}`
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${this.cfApiToken}` }
      })
      if (!res.ok) return false
      const parsed = await res.json() as { articles: [string, Article][], wordArticles: [string, Article[]][], timestamp: number }
      const now = Date.now()
      const expiryTime = this.options.cacheExpiryHours! * 60 * 60 * 1000
      if (now - parsed.timestamp < expiryTime) {
        this.articles = new Map(parsed.articles)
        this.wordArticles = new Map(parsed.wordArticles)
        console.log(`Articles loaded from Cloudflare KV: ${this.articles.size} articles`)
        return true
      }
      return false
    } catch (e) {
      console.warn('Failed to load from CF KV:', e)
      return false
    }
  }

  /**
   * Persist articles to Upstash (if configured)
   */
  private async persistToUpstash(): Promise<boolean> {
    if (!this.upstashUrl || !this.upstashToken) return false
    try {
      const storageData = {
        articles: Array.from(this.articles.entries()),
        wordArticles: Array.from(this.wordArticles.entries()),
        timestamp: Date.now()
      }
      const res = await fetch(`${this.upstashUrl}/set/${this.redisKey}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.upstashToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: JSON.stringify(storageData) })
      })
      return res.ok
    } catch (e) {
      console.warn('Failed to persist to Upstash:', e)
      return false
    }
  }

  /**
   * Load from Upstash (if configured)
   */
  private async loadFromUpstash(): Promise<boolean> {
    if (!this.upstashUrl || !this.upstashToken) return false
    try {
      const res = await fetch(`${this.upstashUrl}/get/${this.redisKey}`, {
        headers: { 'Authorization': `Bearer ${this.upstashToken}` }
      })
      if (!res.ok) return false
      type UpstashGetResponse = { result?: string | null }
      const json = await res.json().catch(() => null) as UpstashGetResponse | null
      const raw = json?.result || null
      if (!raw) return false
      const parsed = JSON.parse(raw) as { articles: [string, Article][], wordArticles: [string, Article[]][], timestamp: number }
      const now = Date.now()
      const expiryTime = this.options.cacheExpiryHours! * 60 * 60 * 1000
      if (now - parsed.timestamp < expiryTime) {
        this.articles = new Map(parsed.articles)
        this.wordArticles = new Map(parsed.wordArticles)
        console.log(`Articles loaded from Upstash KV: ${this.articles.size} articles`)
        return true
      }
      return false
    } catch (e) {
      console.warn('Failed to load from Upstash:', e)
      return false
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
   * Load articles (CF KV → Upstash → file system → localStorage)
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
          // Clear in-memory maps when cache expired
          this.articles.clear()
          this.wordArticles.clear()
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
   * Initialize storage (Cloudflare KV → Upstash KV → file system → localStorage)
   */
  public async initialize(): Promise<void> {
    // Try Cloudflare KV (preferred)
    const loadedFromCf = await this.loadFromCloudflareKV()

    // Then Upstash
    const loadedFromUpstash = loadedFromCf ? true : await this.loadFromUpstash()

    if (!loadedFromCf && !loadedFromUpstash) {
      // Fallback to file system (dev/local)
      await this.loadFromFileSystem()
    }
    
    // Then try to load from localStorage (client-side cache)
    this.loadFromLocalStorage()
    
    console.log(`Article storage initialized with ${this.articles.size} articles`)
  }
} 