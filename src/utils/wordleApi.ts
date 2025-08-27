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
        console.log('Returning cached today word')
        return {
          success: true,
          data: cached.data
        }
      }

      // Try to get from API with fast timeout
      console.log('Attempting to fetch from external Wordle API...')
      
      // 使用Promise.race来实现快速故障转移
      const apiPromise = this.fetchFromApi('/today')
      const timeoutPromise = new Promise<WordleApiResponse>((resolve) => {
        setTimeout(() => {
          console.log('API request timeout, falling back to local data...')
          resolve(this.getLocalFallbackData())
        }, 3000) // 3秒超时
      })

      const response = await Promise.race([apiPromise, timeoutPromise])
      
      if (response.success && response.data && response.data.source?.includes('Wordle API')) {
        // Cache the result
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })
        
        console.log(`Successfully fetched word: ${response.data.word} from external API`)
        return response
      }

      // Fallback to local data if API fails or times out
      console.log('Using local fallback data...')
      return this.getLocalFallbackData()
      
    } catch (error) {
      console.error('Error fetching today word:', error)
      console.log('Falling back to local data due to error...')
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
    console.log('Cleared today\'s cache, forcing refresh...')
    
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
        console.log(`Returning cached word for date: ${date}`)
        return {
          success: true,
          data: cached.data
        }
      }

      // Try to get from API
      const response = await this.fetchFromApi(`/word/${date}`)
      
      if (response.success && response.data) {
        // Cache the result
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })
        
        return response
      }

      // Fallback to local data if API fails
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
        console.log(`Returning cached word for number: ${wordNumber}`)
        return {
          success: true,
          data: cached.data
        }
      }

      // Try to get from API
      const response = await this.fetchFromApi(`/word/${wordNumber}`)
      
      if (response.success && response.data) {
        // Cache the result
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })
        
        return response
      }

      // Fallback to local data if API fails
      return this.getLocalFallbackData(undefined, wordNumber)
      
    } catch (error) {
      console.error(`Error fetching word for number ${wordNumber}:`, error)
      return this.getLocalFallbackData(undefined, wordNumber)
    }
  }

  /**
   * Fetch data from the Wordle API with retry and fallback
   */
  private async fetchFromApi(endpoint: string): Promise<WordleApiResponse> {
    const maxRetries = API_CONFIG.MAX_RETRIES
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const baseUrl = this.baseUrls[this.currentApiIndex]
        // 智能拼接，避免出现 .../today/today 或 .../word/word/today
        const base = baseUrl.replace(/\/$/, '')
        const firstSeg = endpoint.replace(/^\//, '').split('/')[0] || ''
        const trimmedEndpoint = firstSeg && base.endsWith(`/${firstSeg}`)
          ? endpoint.replace(new RegExp(`^\/${firstSeg}`), '')
          : endpoint
        const url = `${base}${trimmedEndpoint}`
        
        console.log(`Attempt ${attempt + 1}: Trying API endpoint: ${url}`)
        
        const headers: Record<string, string> = {
          ...API_CONFIG.DEFAULT_HEADERS,
          'User-Agent': API_CONFIG.USER_AGENT
        }
        
        if (this.apiKey) {
          headers['Authorization'] = `Bearer ${this.apiKey}`
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

        // 代理支持：若设置 PROXY_BASE，则通过代理拼接或使用 Agent
        const fetchOptions: RequestInit = {
          method: 'GET',
          headers,
          signal: controller.signal,
          next: { revalidate: 3600 }
        }

        let finalUrl = url
        const proxyBase = API_CONFIG.PROXY_BASE
        if (proxyBase && proxyBase.trim().length > 0) {
          try {
            // 优先使用 HttpsProxyAgent
            // @ts-expect-error Node-fetch agent type in Next runtime
            fetchOptions.agent = new HttpsProxyAgent(proxyBase)
          } catch {
            // 退化为通过反向代理拼接路径
            if (proxyBase.includes('/http')) {
              // 例如 r.jina.ai/http/<原始URL> 需要完整URL
              finalUrl = `${proxyBase.replace(/\/$/, '')}/${url}`
            } else {
              // 常规反代：拼接去掉协议的URL
              finalUrl = `${proxyBase.replace(/\/$/, '')}/${url.replace(/^https?:\/\//, '')}`
            }
          }
        }

        const response = await fetch(finalUrl, fetchOptions)

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        
        // 特殊处理纽约时报官方API
        if (baseUrl.includes('nytimes.com')) {
          console.log(`✅ Successfully fetched from NYTimes official API: ${baseUrl}`)
          return {
            success: true,
            data: {
              word: data.solution || data.word,
              wordNumber: data.id || this.calculateWordNumberFromDate(new Date()),
              date: data.print_date || new Date().toISOString().split('T')[0],
              source: 'NYTimes Official Wordle API',
              isReal: true
            }
          }
        }
        
        // 处理其他API格式
        if (data.success && data.data) {
          console.log(`✅ Successfully fetched from API endpoint: ${baseUrl}`)
          return {
            success: true,
            data: {
              word: data.data.word || data.data.solution,
              wordNumber: data.data.wordNumber || data.data.id,
              date: data.data.date || new Date().toISOString().split('T')[0],
              source: `Wordle API (${baseUrl})`,
              isReal: true
            }
          }
        }

        // Try next API endpoint
        this.currentApiIndex = (this.currentApiIndex + 1) % this.baseUrls.length
        lastError = new Error('Invalid API response format')
        
      } catch (error) {
        console.error(`❌ API attempt ${attempt + 1} failed:`, error)
        lastError = error instanceof Error ? error : new Error('Unknown API error')
        
        // Try next API endpoint
        this.currentApiIndex = (this.currentApiIndex + 1) % this.baseUrls.length
        
        // Wait before retrying (reduced wait time)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY))
        }
      }
    }

    // All API attempts failed
    console.error('❌ All API endpoints failed, falling back to local data')
    return {
      success: false,
      error: lastError?.message || 'All API endpoints failed',
      message: 'Failed to fetch data from all Wordle API endpoints'
    }
  }

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
    console.log(`Date calculation debug:`)
    console.log(`  Target date: ${targetDate.toISOString().split('T')[0]}`)
    console.log(`  Wordle epoch: 2021-06-19`)
    console.log(`  Days since epoch: ${daysSinceEpoch}`)
    console.log(`  Calculated word number: ${calculatedWordNumber}`)
    
    // Use a fallback word based on the actual date to ensure daily changes
    const fallbackWords = FALLBACK_WORDS
    
    // Use date-based selection to ensure daily changes
    // Use the actual date string as a seed for more variety
    const dateString = targetDate.toISOString().split('T')[0]
    const dateSeed = parseInt(dateString.replace(/-/g, ''), 10)
    const wordIndex = (dateSeed + calculatedWordNumber) % fallbackWords.length
    const fallbackWord = fallbackWords[wordIndex]
    
    console.log(`Word selection debug:`)
    console.log(`  Date string: ${dateString}`)
    console.log(`  Date seed: ${dateSeed}`)
    console.log(`  Word index: ${wordIndex}`)
    console.log(`  Selected word: ${fallbackWord}`)
    
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
    console.log('Wordle API cache cleared')
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
      console.log(`Cleaned ${expiredKeys.length} expired cache entries`)
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

    console.log('🔍 开始测试所有API端点...')

    for (let i = 0; i < this.baseUrls.length; i++) {
      try {
        const baseUrl = this.baseUrls[i]
        const url = `${baseUrl}/today`
        
        console.log(`📡 测试端点 ${i + 1}/${this.baseUrls.length}: ${url}`)
        
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
          console.log(`✅ API端点工作正常: ${baseUrl}`)
          
          // 如果找到工作的端点，立即设置为当前端点
          if (this.currentApiIndex !== i) {
            this.currentApiIndex = i
            console.log(`🔄 切换到工作端点: ${baseUrl}`)
          }
        } else {
          failedEndpoints.push(baseUrl)
          console.log(`❌ API端点失败: ${baseUrl} - ${response.status}`)
        }
      } catch (error) {
        failedEndpoints.push(this.baseUrls[i])
        lastError = error instanceof Error ? error.message : 'Unknown error'
        console.log(`❌ API端点失败: ${this.baseUrls[i]} - ${lastError}`)
      }
    }

    console.log(`📊 API测试完成: ${workingEndpoints.length} 个工作, ${failedEndpoints.length} 个失败`)

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