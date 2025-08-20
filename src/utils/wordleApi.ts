import { WordleDailyData } from '@/types/article'

export interface WordleApiResponse {
  success: boolean
  data?: WordleDailyData
  error?: string
  message?: string
}

export class WordleApiService {
  private static instance: WordleApiService
  private baseUrl: string
  private apiKey?: string
  private cache: Map<string, { data: WordleDailyData; timestamp: number }> = new Map()
  private cacheExpiryMs = 24 * 60 * 60 * 1000 // 24 hours

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WORDLE_API_URL || 'https://wordle-api.vercel.app/api'
    this.apiKey = process.env.WORDLE_API_KEY
  }

  public static getInstance(): WordleApiService {
    if (!WordleApiService.instance) {
      WordleApiService.instance = new WordleApiService()
    }
    return WordleApiService.instance
  }

  /**
   * Get today's Wordle word
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

      // Try to get from API
      const response = await this.fetchFromApi('/today')
      
      if (response.success && response.data) {
        // Cache the result
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now()
        })
        
        return response
      }

      // Fallback to local data if API fails
      return this.getLocalFallbackData()
      
    } catch (error) {
      console.error('Error fetching today word:', error)
      return this.getLocalFallbackData()
    }
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
   * Fetch data from the Wordle API
   */
  private async fetchFromApi(endpoint: string): Promise<WordleApiResponse> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
        next: { revalidate: 3600 } // Cache for 1 hour
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        return {
          success: true,
          data: {
            word: data.data.word || data.data.solution,
            wordNumber: data.data.wordNumber || data.data.id,
            date: data.data.date || new Date().toISOString().split('T')[0],
            source: 'Wordle API',
            isReal: true
          }
        }
      }

      return {
        success: false,
        error: 'Invalid API response format',
        message: 'The API returned an unexpected response format'
      }

    } catch (error) {
      console.error('API fetch error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown API error',
        message: 'Failed to fetch data from Wordle API'
      }
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
    
    // Use a fallback word (you can expand this list)
    const fallbackWords = [
      'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT',
      'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
      'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER',
      'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE',
      'ARRAY', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWARD', 'AWARE'
    ]
    
    const wordIndex = (calculatedWordNumber - 1) % fallbackWords.length
    const fallbackWord = fallbackWords[wordIndex]
    
    console.log(`Using fallback word: ${fallbackWord} for date: ${date || 'today'}`)
    
    return {
      success: true,
      data: {
        word: fallbackWord,
        wordNumber: calculatedWordNumber,
        date: date || today.toISOString().split('T')[0],
        source: 'Local Fallback',
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
} 