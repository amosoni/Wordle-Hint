import { ArticleManager } from './articleManager'

export interface SchedulerOptions {
  enableDailyGeneration?: boolean
  generationTime?: string // HH:MM format
  enableCacheCleanup?: boolean
  cacheCleanupInterval?: number // hours
}

export class ArticleScheduler {
  private static instance: ArticleScheduler
  private articleManager: ArticleManager
  private options: SchedulerOptions
  private dailyTimer?: NodeJS.Timeout
  private cacheCleanupTimer?: NodeJS.Timeout
  private isRunning = false

  private constructor(options: SchedulerOptions = {}) {
    this.options = {
      enableDailyGeneration: true,
      generationTime: '00:01', // 12:01 AM
      enableCacheCleanup: true,
      cacheCleanupInterval: 6, // 6 hours
      ...options
    }
    
    this.articleManager = ArticleManager.getInstance()
  }

  public static getInstance(options?: SchedulerOptions): ArticleScheduler {
    if (!ArticleScheduler.instance) {
      ArticleScheduler.instance = new ArticleScheduler(options)
    }
    return ArticleScheduler.instance
  }

  /**
   * Start the scheduler
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Scheduler is already running')
      return
    }

    try {
      console.log('Starting article scheduler...')
      
      // Initialize article manager
      await this.articleManager.initialize()
      
      // Schedule daily article generation
      if (this.options.enableDailyGeneration) {
        this.scheduleDailyGeneration()
      }
      
      // Schedule cache cleanup
      if (this.options.enableCacheCleanup) {
        this.scheduleCacheCleanup()
      }
      
      this.isRunning = true
      console.log('Article scheduler started successfully')
      
    } catch (error) {
      console.error('Failed to start scheduler:', error)
      throw error
    }
  }

  /**
   * Stop the scheduler
   */
  public stop(): void {
    if (!this.isRunning) {
      console.log('Scheduler is not running')
      return
    }

    console.log('Stopping article scheduler...')
    
    // Clear timers
    if (this.dailyTimer) {
      clearTimeout(this.dailyTimer)
      this.dailyTimer = undefined
    }
    
    if (this.cacheCleanupTimer) {
      clearTimeout(this.cacheCleanupTimer)
      this.cacheCleanupTimer = undefined
    }
    
    this.isRunning = false
    console.log('Article scheduler stopped')
  }

  /**
   * Schedule daily article generation
   */
  private scheduleDailyGeneration(): void {
    const [hours, minutes] = this.options.generationTime!.split(':').map(Number)
    const now = new Date()
    const nextRun = new Date()
    
    nextRun.setHours(hours, minutes, 0, 0)
    
    // If today's time has passed, schedule for tomorrow
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1)
    }
    
    const timeUntilNextRun = nextRun.getTime() - now.getTime()
    
    console.log(`Next daily article generation scheduled for: ${nextRun.toISOString()}`)
    
    this.dailyTimer = setTimeout(async () => {
      await this.generateDailyArticles()
      // Schedule next run
      this.scheduleDailyGeneration()
    }, timeUntilNextRun)
  }

  /**
   * Schedule cache cleanup
   */
  private scheduleCacheCleanup(): void {
    const intervalMs = this.options.cacheCleanupInterval! * 60 * 60 * 1000
    
    console.log(`Cache cleanup scheduled every ${this.options.cacheCleanupInterval} hours`)
    
    this.cacheCleanupTimer = setInterval(async () => {
      await this.cleanupCaches()
    }, intervalMs)
  }

  /**
   * Generate articles for today
   */
  private async generateDailyArticles(): Promise<void> {
    try {
      console.log('Starting daily article generation...')
      
      // Ensure today's articles exist
      await this.articleManager.ensureTodayArticles()
      
      console.log('Daily article generation completed')
      
    } catch (error) {
      console.error('Failed to generate daily articles:', error)
    }
  }

  /**
   * Clean up expired caches
   */
  private async cleanupCaches(): Promise<void> {
    try {
      console.log('Starting cache cleanup...')
      
      this.articleManager.cleanExpiredCaches()
      
      console.log('Cache cleanup completed')
      
    } catch (error) {
      console.error('Failed to cleanup caches:', error)
    }
  }

  /**
   * Manually trigger article generation
   */
  public async triggerManualGeneration(word?: string): Promise<void> {
    try {
      if (word) {
        console.log(`Manually triggering article generation for word: ${word}`)
        await this.articleManager.forceRegenerateArticles(word)
      } else {
        console.log('Manually triggering daily article generation')
        await this.generateDailyArticles()
      }
    } catch (error) {
      console.error('Manual generation failed:', error)
      throw error
    }
  }

  /**
   * Get scheduler status
   */
  public getStatus(): {
    isRunning: boolean
    nextDailyRun?: string
    cacheCleanupInterval: number
    options: SchedulerOptions
  } {
    return {
      isRunning: this.isRunning,
      nextDailyRun: this.getNextDailyRunTime(),
      cacheCleanupInterval: this.options.cacheCleanupInterval!,
      options: this.options
    }
  }

  /**
   * Get next daily run time
   */
  private getNextDailyRunTime(): string | undefined {
    if (!this.dailyTimer) return undefined
    
    const [hours, minutes] = this.options.generationTime!.split(':').map(Number)
    const now = new Date()
    const nextRun = new Date()
    
    nextRun.setHours(hours, minutes, 0, 0)
    
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1)
    }
    
    return nextRun.toISOString()
  }

  /**
   * Update scheduler options
   */
  public updateOptions(newOptions: Partial<SchedulerOptions>): void {
    this.options = { ...this.options, ...newOptions }
    console.log('Scheduler options updated:', this.options)
    
    // Restart scheduler if running
    if (this.isRunning) {
      this.stop()
      this.start()
    }
  }

  /**
   * Check if scheduler is healthy
   */
  public async healthCheck(): Promise<{
    healthy: boolean
    issues: string[]
    lastRun?: string
  }> {
    const issues: string[] = []
    
    try {
      // Check if article manager is working
      const status = await this.articleManager.getStatus()
      
      if (!status.isInitialized) {
        issues.push('Article manager not initialized')
      }
      
      if (status.isGenerating) {
        issues.push('Article generation in progress')
      }
      
      return {
        healthy: issues.length === 0,
        issues,
        lastRun: status.todayWord ? 'Today' : 'Unknown'
      }
      
    } catch (error) {
      issues.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return {
        healthy: false,
        issues
      }
    }
  }
} 