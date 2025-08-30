import { WordleDailyData } from '@/types/article'
import { API_CONFIG, FALLBACK_WORDS } from '@/config/api'

export interface WordleApiResponse {
  success: boolean
  data?: WordleDailyData
  error?: string
  message?: string
}

export class WordleApiService {
  private static instance: WordleApiService
  private baseUrls: string[]
  private apiKey?: string
  private cache: Map<string, { data: WordleDailyData; timestamp: number }> = new Map()
  private cacheExpiryMs = API_CONFIG.CACHE_EXPIRY_MS
  private currentApiIndex = 0

  private constructor() {
    // 使用配置文件中的API端点
    this.baseUrls = API_CONFIG.WORDLE_API_ENDPOINTS
    this.apiKey = process.env.WORDLE_API_KEY
  }

  public static getInstance(): WordleApiService {
    if (!WordleApiService.instance) {
      WordleApiService.instance = new WordleApiService()
    }
    return WordleApiService.instance
  }

  /**
   * Get today's Wordle word with fast fallback
   */
  public async getTodayWord(): Promise<WordleApiResponse> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const cacheKey = `today-${today}`
      
      // Check cache first
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
        // console.log('Returning cached today word')
        return {
          success: true,
          data: cached.data
        }
      }

      // Skip API calls to avoid error logging - use local data directly
      // console.log('Skipping API calls to avoid error logging...')
      return this.getLocalFallbackData()
      
    } catch (error) {
      console.error('Error fetching today word:', error)
      // console.log('Falling back to local data due to error...')
      return this.getLocalFallbackData()
    }
  }

  /**
   * Force refresh today's word (clear cache and fetch new data)
   */
  public async forceRefreshTodayWord(): Promise<WordleApiResponse> {
    const today = new Date().toISOString().split('T')[0]
    const cacheKey = `today-${today}`
    
    // Clear today's cache
    this.cache.delete(cacheKey)
    // console.log('Cleared today\'s cache, forcing refresh...')
    
    // Fetch fresh data
    return this.getTodayWord()
  }

  /**
   * Get Wordle word for a specific date
   */
  public async getWordForDate(date: string): Promise<WordleApiResponse> {
    try {
      const cacheKey = `date-${date}`
      
      // Check cache first
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
        // console.log(`Returning cached word for date: ${date}`)
        return {
          success: true,
          data: cached.data
        }
      }

      // Skip API calls to avoid error logging - use local data directly
      return this.getLocalFallbackData(date)
      
    } catch (error) {
      console.error(`Error fetching word for date ${date}:`, error)
      return this.getLocalFallbackData(date)
    }
  }

  /**
   * Get Wordle word by number
   */
  public async getWordByNumber(wordNumber: number): Promise<WordleApiResponse> {
    try {
      const cacheKey = `number-${wordNumber}`
      
      // Check cache first
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
        // console.log(`Returning cached word for number: ${wordNumber}`)
        return {
          success: true,
          data: cached.data
        }
      }

      // Skip API calls to avoid error logging - use local data directly
      return this.getLocalFallbackData(undefined, wordNumber)
      
    } catch (error) {
      console.error(`Error fetching word for number ${wordNumber}:`, error)
      return this.getLocalFallbackData(undefined, wordNumber)
    }
  }

  // fetchFromApi function removed to prevent API calls and error logging

  /**
   * Get local fallback data when API fails
   */
  private getLocalFallbackData(date?: string, wordNumber?: number): WordleApiResponse {
    const today = new Date()
    const targetDate = date ? new Date(date) : today
    
    // Calculate Wordle number based on date
    const wordleEpoch = new Date('2021-06-19') // Wordle started on this date
    const daysSinceEpoch = Math.floor((targetDate.getTime() - wordleEpoch.getTime()) / (1000 * 60 * 60 * 24))
    const calculatedWordNumber = wordNumber || Math.max(1, daysSinceEpoch)
    
    // Debug information
    // console.log(`Date calculation debug:`)
    // console.log(`  Target date: ${targetDate.toISOString().split('T')[0]}`)
    // console.log(`  Wordle epoch: 2021-06-19`)
    // console.log(`  Days since epoch: ${daysSinceEpoch}`)
    // console.log(`  Calculated word number: ${calculatedWordNumber}`)
    
    // Use a fallback word based on the actual date to ensure daily changes
    const fallbackWords = FALLBACK_WORDS
    
    // Use date-based selection to ensure daily changes
    // Use the actual date string as a seed for more variety
    const dateString = targetDate.toISOString().split('T')[0]
    const dateSeed = parseInt(dateString.replace(/-/g, ''), 10)
    const wordIndex = (dateSeed + calculatedWordNumber) % fallbackWords.length
    const fallbackWord = fallbackWords[wordIndex]
    
    return {
      success: true,
      data: {
        word: fallbackWord,
        wordNumber: calculatedWordNumber,
        date: date || today.toISOString().split('T')[0],
        source: 'Local Fallback (Daily Rotating)',
        isReal: false
      }
    }
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear()
    // console.log('Wordle API cache cleared')
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    totalEntries: number
    expiredEntries: number
    validEntries: number
  } {
    const now = Date.now()
    let expiredCount = 0
    let validCount = 0
    
    for (const entry of this.cache.values()) {
      if (now - entry.timestamp >= this.cacheExpiryMs) {
        expiredCount++
      } else {
        validCount++
      }
    }
    
    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      validEntries: validCount
    }
  }

  /**
   * Clean expired cache entries
   */
  public cleanExpiredCache(): void {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.cacheExpiryMs) {
        expiredKeys.push(key)
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key))
    
    if (expiredKeys.length > 0) {
      // console.log(`Cleaned ${expiredKeys.length} expired cache entries`)
    }
  }

  /**
   * Test API connectivity and return status
   */
  public async testApiConnectivity(): Promise<{
    isConnected: boolean
    workingEndpoints: string[]
    failedEndpoints: string[]
    lastError?: string
  }> {
    const workingEndpoints: string[] = []
    const failedEndpoints: string[] = []
    let lastError: string | undefined

    // console.log('🔍 开始测试所有API端点...')

    for (let i = 0; i < this.baseUrls.length; i++) {
      try {
        const baseUrl = this.baseUrls[i]
        const url = `${baseUrl}/today`
        
        // console.log(`📡 测试端点 ${i + 1}/${this.baseUrls.length}: ${url}`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Wordle-Hint-Pro/1.0'
          },
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          workingEndpoints.push(baseUrl)
          // console.log(`✅ API端点工作正常: ${baseUrl}`)
          
          // 如果找到工作的端点，立即设置为当前端点
          if (this.currentApiIndex !== i) {
            this.currentApiIndex = i
            // console.log(`🔄 切换到工作端点: ${baseUrl}`)
          }
        } else {
          failedEndpoints.push(baseUrl)
          // console.log(`❌ API端点失败: ${baseUrl} - ${response.status}`)
        }
      } catch (error) {
        failedEndpoints.push(this.baseUrls[i])
        lastError = error instanceof Error ? error.message : 'Unknown error'
        // console.log(`❌ API端点失败: ${this.baseUrls[i]} - ${lastError}`)
      }
    }

    // console.log(`📊 API测试完成: ${workingEndpoints.length} 个工作, ${failedEndpoints.length} 个失败`)

    return {
      isConnected: workingEndpoints.length > 0,
      workingEndpoints,
      failedEndpoints,
      lastError
    }
  }

  /**
   * Get system status information
   */
  public getStatus(): {
    totalEndpoints: number
    workingEndpoints: number
    currentApiIndex: number
    cacheSize: number
    cacheExpiryMs: number
  } {
    return {
      totalEndpoints: this.baseUrls.length,
      workingEndpoints: 0, // This would need to be updated by testApiConnectivity
      currentApiIndex: this.currentApiIndex,
      cacheSize: this.cache.size,
      cacheExpiryMs: this.cacheExpiryMs
    }
  }

  /**
   * Calculate Wordle word number from a given date
   * Based on the official Wordle epoch (June 19, 2021)
   */
  private calculateWordNumberFromDate(date: Date): number {
    const epoch = new Date('2021-06-19')
    const timeDiff = date.getTime() - epoch.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return Math.max(0, daysDiff)
  }
} 