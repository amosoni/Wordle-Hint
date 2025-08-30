import { ArticleManager } from './articleManager'
import { WordleApiService } from './wordleApi'

export interface SchedulerOptions {
  enableDailyGeneration?: boolean
  generationTime?: string // HH:MM format
  enableCacheCleanup?: boolean
  cacheCleanupInterval?: number // hours
  enableWordleCacheRefresh?: boolean
  wordleCacheRefreshInterval?: number // hours
  enableHealthMonitoring?: boolean
  healthCheckInterval?: number // minutes
}

export class ArticleScheduler {
  private static instance: ArticleScheduler
  private articleManager: ArticleManager
  private wordleApi: WordleApiService
  private options: SchedulerOptions
  private dailyTimer?: NodeJS.Timeout
  private cacheCleanupTimer?: NodeJS.Timeout
  private wordleCacheTimer?: NodeJS.Timeout
  private healthCheckTimer?: NodeJS.Timeout
  private isRunning = false
  private lastDailyRun?: Date
  private lastWordleRefresh?: Date
  private lastCacheCleanup?: Date

  private constructor(options: SchedulerOptions = {}) {
    this.options = {
      enableDailyGeneration: true,
      generationTime: '00:00', // 12:00 AM (midnight)
      enableCacheCleanup: true,
      cacheCleanupInterval: 6, // 6 hours
      enableWordleCacheRefresh: true,
      wordleCacheRefreshInterval: 2, // 2 hours
      enableHealthMonitoring: true,
      healthCheckInterval: 30, // 30 minutes
      ...options
    }
    
    this.articleManager = ArticleManager.getInstance()
    this.wordleApi = WordleApiService.getInstance()
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
      // console.log('🚀 Starting enhanced article scheduler...')
      
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
      
      // Schedule Wordle cache refresh
      if (this.options.enableWordleCacheRefresh) {
        this.scheduleWordleCacheRefresh()
      }
      
      // Schedule health monitoring
      if (this.options.enableHealthMonitoring) {
        this.scheduleHealthMonitoring()
      }
      
      this.isRunning = true
      // console.log('✅ Enhanced article scheduler started successfully')
      
      // Log next scheduled runs
      this.logNextScheduledRuns()
      
    } catch (error) {
      console.error('❌ Failed to start scheduler:', error)
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

    // console.log('🛑 Stopping enhanced article scheduler...')
    
    // Clear all timers
    if (this.dailyTimer) {
      clearTimeout(this.dailyTimer)
      this.dailyTimer = undefined
    }
    
    if (this.cacheCleanupTimer) {
      clearInterval(this.cacheCleanupTimer)
      this.cacheCleanupTimer = undefined
    }
    
    if (this.wordleCacheTimer) {
      clearInterval(this.wordleCacheTimer)
      this.wordleCacheTimer = undefined
    }
    
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
      this.healthCheckTimer = undefined
    }
    
    this.isRunning = false
    // console.log('✅ Enhanced article scheduler stopped')
  }

  /**
   * Schedule daily article generation at midnight
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
    
    // console.log(`📅 Next daily article generation scheduled for: ${nextRun.toLocaleString()}`)
    
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
    
    // console.log(`🧹 Cache cleanup scheduled every ${this.options.cacheCleanupInterval} hours`)
    
    this.cacheCleanupTimer = setInterval(async () => {
      await this.cleanupCaches()
    }, intervalMs)
  }

  /**
   * Schedule Wordle cache refresh
   */
  private scheduleWordleCacheRefresh(): void {
    const intervalMs = this.options.wordleCacheRefreshInterval! * 60 * 60 * 1000
    
    // console.log(`🔄 Wordle cache refresh scheduled every ${this.options.wordleCacheRefreshInterval} hours`)
    
    // Run immediately on start
    this.refreshWordleCache()
    
    this.wordleCacheTimer = setInterval(async () => {
      await this.refreshWordleCache()
    }, intervalMs)
  }

  /**
   * Schedule health monitoring
   */
  private scheduleHealthMonitoring(): void {
    const intervalMs = this.options.healthCheckInterval! * 1000
    
    // console.log(`💓 Health monitoring scheduled every ${this.options.healthCheckInterval} minutes`)
    
    this.healthCheckTimer = setInterval(async () => {
      await this.performHealthCheck()
    }, intervalMs)
  }

  /**
   * Generate articles for today with enhanced logging
   */
  private async generateDailyArticles(): Promise<void> {
    try {
      this.lastDailyRun = new Date()
      // console.log('🌅 Starting daily article generation...')
      // console.log(`⏰ Time: ${this.lastDailyRun.toLocaleString()}`)
      
      // Clear Wordle cache to ensure fresh data
      this.wordleApi.clearCache()
      // console.log('🗑️ Cleared Wordle cache for fresh daily data')
      
      // Ensure today's articles exist
      await this.articleManager.ensureTodayArticles()
      
      // console.log('✅ Daily article generation completed successfully')
      
      // Log system status
      await this.logSystemStatus()
      
    } catch (error) {
      console.error('❌ Failed to generate daily articles:', error)
    }
  }

  /**
   * Refresh Wordle cache
   */
  private async refreshWordleCache(): Promise<void> {
    try {
      this.lastWordleRefresh = new Date()
      // console.log('🔄 Refreshing Wordle cache...')
      
      // Clear expired cache entries
      this.wordleApi.cleanExpiredCache()
      
      // Get cache statistics
      // const stats = this.wordleApi.getCacheStats()
      // console.log(`📊 Wordle cache stats: ${stats.validEntries} valid, ${stats.expiredEntries} expired`)
      
      // Try to fetch fresh data
      const response = await this.wordleApi.getTodayWord()
      if (response.success) {
        // console.log(`✅ Wordle cache refreshed successfully. Current word: ${response.data?.word}`)
      } else {
        // console.log('⚠️ Wordle cache refresh failed, using fallback data')
      }
      
    } catch (error) {
      console.error('❌ Failed to refresh Wordle cache:', error)
    }
  }

  /**
   * Clean up expired caches
   */
  private async cleanupCaches(): Promise<void> {
    try {
      this.lastCacheCleanup = new Date()
      // console.log('🧹 Starting cache cleanup...')
      
      // Clear expired Wordle cache entries
      this.wordleApi.cleanExpiredCache()
      
      // Clear expired article cache entries
      this.articleManager.cleanExpiredCaches()
      
      // console.log('✅ Cache cleanup completed')
      
    } catch (error) {
      console.error('❌ Cache cleanup failed:', error)
    }
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const health = await this.healthCheck()
      
      if (!health.healthy) {
        console.warn('⚠️ Health check issues detected:', health.issues)
      } else {
        // console.log('💓 System health check passed')
      }
      
    } catch (error) {
      console.error('❌ Health check failed:', error)
    }
  }

  /**
   * Log system status
   */
  private async logSystemStatus(): Promise<void> {
    try {
      // const articleStatus = await this.articleManager.getStatus()
      // const wordleStats = this.wordleApi.getCacheStats()
      
      // console.log('📊 System Status:')
      // console.log(`   📚 Articles: ${articleStatus.totalArticles}`)
      // console.log(`   🎯 Today's Word: ${articleStatus.todayWord || 'Unknown'}`)
      // console.log(`   🗂️ Wordle Cache: ${wordleStats.validEntries} valid entries`)
      // console.log(`   ⏰ Last Daily Run: ${this.lastDailyRun?.toLocaleString() || 'Never'}`)
      // console.log(`   🔄 Last Wordle Refresh: ${this.lastWordleRefresh?.toLocaleString() || 'Never'}`)
      
    } catch (error) {
      console.error('❌ Failed to log system status:', error)
    }
  }

  /**
   * Log next scheduled runs
   */
  private logNextScheduledRuns(): void {
    const [hours, minutes] = this.options.generationTime!.split(':').map(Number)
    const now = new Date()
    const nextDaily = new Date()
    
    nextDaily.setHours(hours, minutes, 0, 0)
    if (nextDaily <= now) {
      nextDaily.setDate(nextDaily.getDate() + 1)
    }
    
    // console.log('📅 Scheduled Runs:')
    // console.log(`   🌅 Daily Generation: ${nextDaily.toLocaleString()}`)
    // console.log(`   🧹 Cache Cleanup: Every ${this.options.cacheCleanupInterval} hours`)
    // console.log(`   🔄 Wordle Refresh: Every ${this.options.wordleCacheRefreshInterval} hours`)
    // console.log(`   💓 Health Check: Every ${this.options.healthCheckInterval} minutes`)
  }

  /**
   * Manually trigger article generation
   */
  public async triggerManualGeneration(word?: string): Promise<void> {
    try {
      if (word) {
        // console.log(`🔧 Manually triggering article generation for word: ${word}`)
        await this.articleManager.forceRegenerateArticles(word)
      } else {
        // console.log('🔧 Manually triggering daily article generation')
        await this.generateDailyArticles()
      }
    } catch (error) {
      console.error('❌ Manual generation failed:', error)
      throw error
    }
  }

  /**
   * Force refresh Wordle data
   */
  public async forceRefreshWordleData(): Promise<void> {
    try {
      // console.log('🔄 Force refreshing Wordle data...')
      await this.refreshWordleCache()
    } catch (error) {
      console.error('❌ Force refresh failed:', error)
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
    wordleCacheRefreshInterval: number
    healthCheckInterval: number
    lastDailyRun?: string
    lastWordleRefresh?: string
    options: SchedulerOptions
  } {
    return {
      isRunning: this.isRunning,
      nextDailyRun: this.getNextDailyRunTime(),
      cacheCleanupInterval: this.options.cacheCleanupInterval!,
      wordleCacheRefreshInterval: this.options.wordleCacheRefreshInterval!,
      healthCheckInterval: this.options.healthCheckInterval!,
      lastDailyRun: this.lastDailyRun?.toISOString(),
      lastWordleRefresh: this.lastWordleRefresh?.toISOString(),
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
    console.log('⚙️ Scheduler options updated:', this.options)
    
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
    lastWordleRefresh?: string
    cacheStats: {
      totalEntries: number
      expiredEntries: number
      validEntries: number
    }
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
      
      // Check Wordle API cache
      const wordleStats = this.wordleApi.getCacheStats()
      
      // Check if scheduler is running
      if (!this.isRunning) {
        issues.push('Scheduler not running')
      }
      
      return {
        healthy: issues.length === 0,
        issues,
        lastRun: this.lastDailyRun?.toISOString(),
        lastWordleRefresh: this.lastWordleRefresh?.toISOString(),
        cacheStats: wordleStats
      }
      
    } catch (error) {
      issues.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return {
        healthy: false,
        issues,
        cacheStats: {
          totalEntries: 0,
          expiredEntries: 0,
          validEntries: 0
        }
      }
    }
  }
} 