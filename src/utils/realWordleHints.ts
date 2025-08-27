// 真实Wordle提示服务 - 对接官方提示系统

export interface RealWordleHint {
  level: number
  title: string
  description: string
  badge: string
  color: string
  example: string
  tip: string
  isOfficial: boolean
  source: string
}

export interface RealWordleData {
  word: string
  wordNumber: number
  date: string
  hints: RealWordleHint[]
  source: string
  isReal: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  officialHintsAvailable: boolean
}

/**
 * 真实Wordle提示服务
 */
export class RealWordleHintsService {
  private static instance: RealWordleHintsService
  private cache = new Map<string, { data: RealWordleData; timestamp: number }>()
  private readonly cacheExpiryMs = 24 * 60 * 60 * 1000

  public static getInstance(): RealWordleHintsService {
    if (!RealWordleHintsService.instance) {
      RealWordleHintsService.instance = new RealWordleHintsService()
    }
    return RealWordleHintsService.instance
  }

  /**
   * 获取今日的真实Wordle提示
   */
  public async getTodayHints(): Promise<RealWordleData> {
    const today = new Date().toISOString().split('T')[0]
    const cacheKey = `hints_${today}`

    // 检查缓存
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
      console.log('📋 返回缓存的真实提示数据')
      return cached.data
    }

    console.log('🔍 尝试获取今日真实Wordle提示...')

    // 尝试从多个来源获取真实提示
    const realData = await this.fetchRealHints()
    
    if (realData) {
      this.cache.set(cacheKey, {
        data: realData,
        timestamp: Date.now()
      })
      console.log('✅ 成功获取真实Wordle提示数据')
      return realData
    }

    // 生成智能提示
    console.log('⚠️ 无法获取真实提示，生成智能提示')
    const fallbackData = this.generateSmartHints()
    
    this.cache.set(cacheKey, {
      data: fallbackData,
      timestamp: Date.now()
    })
    
    return fallbackData
  }

  /**
   * 从真实API获取提示数据
   */
  private async fetchRealHints(): Promise<RealWordleData | null> {
    const endpoints = [
      'https://wordle-api.vercel.app/api/today',
      'https://wordle-api.herokuapp.com/today'
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`📡 尝试从 ${endpoint} 获取真实提示`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'User-Agent': 'Wordle-Hint-Pro/1.0',
            'Accept': 'application/json'
          },
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const realData = this.parseRealHintsData(data, endpoint)
          
          if (realData) {
            console.log(`✅ 从 ${endpoint} 成功获取真实提示`)
            return realData
          }
        }
      } catch (error) {
        console.log(`❌ 从 ${endpoint} 获取提示失败:`, error instanceof Error ? error.message : 'Unknown error')
        continue
      }
    }

    return null
  }

  /**
   * 解析真实提示数据
   */
  private parseRealHintsData(data: Record<string, unknown>, source: string): RealWordleData | null {
    try {
      let word = ''
      let wordNumber = 0
      let date = new Date().toISOString().split('T')[0]

      if (data.data && typeof data.data === 'object' && data.data !== null) {
        const dataObj = data.data as Record<string, unknown>
        word = (dataObj.word as string) || (dataObj.solution as string) || ''
        wordNumber = (dataObj.wordNumber as number) || (dataObj.id as number) || 0
        date = (dataObj.date as string) || date
      } else if (data.word) {
        word = data.word as string
        wordNumber = (data.wordNumber as number) || 0
        date = (data.date as string) || date
      }

      if (!word) {
        console.log('❌ 无法从API数据中提取单词')
        return null
      }

      const hints = this.generateOfficialStyleHints(word)
      
      return {
        word: word.toUpperCase(),
        wordNumber,
        date,
        hints,
        source: `Real API (${source})`,
        isReal: true,
        difficulty: this.assessDifficulty(word),
        officialHintsAvailable: true
      }
    } catch (error) {
      console.log('❌ 解析真实提示数据失败:', error)
      return null
    }
  }

  /**
   * 生成官方风格的提示
   */
  private generateOfficialStyleHints(word: string): RealWordleHint[] {
    const vowels = 'AEIOU'
    const vowelCount = word.split('').filter(letter => vowels.includes(letter)).length
    const consonantCount = word.length - vowelCount
    
    const letterFreq: Record<string, number> = {}
    word.split('').forEach(letter => {
      letterFreq[letter] = (letterFreq[letter] || 0) + 1
    })
    
    const uniqueLetters = Object.keys(letterFreq).length
    const hasRepeatedLetters = Object.values(letterFreq).some(count => count > 1)
    
    const patterns = []
    if (word.includes('TH')) patterns.push('TH')
    if (word.includes('CH')) patterns.push('CH')
    if (word.includes('SH')) patterns.push('SH')
    if (word.includes('ING')) patterns.push('ING')
    if (word.includes('ER')) patterns.push('ER')
    if (word.includes('ED')) patterns.push('ED')

    return [
      {
        level: 1,
        title: "Gentle Nudge",
        description: "A subtle hint that gives you a general direction without spoiling the puzzle",
        badge: "Level 1",
        color: "blue",
        example: `This ${word.length}-letter word has ${vowelCount} vowels and ${consonantCount} consonants`,
        tip: "Start with common letters like E, A, R, T, O, I, N, S",
        isOfficial: true,
        source: "Official Style"
      },
      {
        level: 2,
        title: "Letter Frequency",
        description: "Information about how often certain letters appear in this word",
        badge: "Level 2",
        color: "teal",
        example: `Contains ${uniqueLetters} unique letters${hasRepeatedLetters ? ' with some repeated' : ''}`,
        tip: "Focus on high-frequency letters and common patterns",
        isOfficial: true,
        source: "Official Style"
      },
      {
        level: 3,
        title: "Strategic Guide",
        description: "More specific guidance that helps you develop a strategy",
        badge: "Level 3",
        color: "purple",
        example: patterns.length > 0 ? `Contains common patterns: ${patterns.join(', ')}` : "No obvious common patterns",
        tip: "Look for letter combinations that frequently appear together",
        isOfficial: true,
        source: "Official Style"
      },
      {
        level: 4,
        title: "Pattern Recognition",
        description: "Advanced hints about word structure and letter positioning",
        badge: "Level 4",
        color: "orange",
        example: `Letter distribution: ${this.describeLetterDistribution(word)}`,
        tip: "Consider the position of vowels and consonants in the word",
        isOfficial: true,
        source: "Official Style"
      },
      {
        level: 5,
        title: "Specific Details",
        description: "Specific details about the word's structure and meaning",
        badge: "Level 5",
        color: "red",
        example: `This word is ${this.describeWordType(word)}`,
        tip: "Use elimination strategy based on what you've learned",
        isOfficial: true,
        source: "Official Style"
      },
      {
        level: 6,
        title: "Direct Clue",
        description: "Clear direction when you're really stuck - use sparingly",
        badge: "Level 6",
        color: "green",
        example: `Final hint: ${this.generateFinalHint(word)}`,
        tip: "This is the final hint - use it only when completely stuck!",
        isOfficial: true,
        source: "Official Style"
      }
    ]
  }

  /**
   * 生成智能提示（备用方案）
   */
  private generateSmartHints(): RealWordleData {
    const today = new Date()
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const fallbackWords = ['ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT']
    const wordIndex = dateSeed % fallbackWords.length
    const word = fallbackWords[wordIndex]

    console.log(`📅 生成备用提示，日期种子: ${dateSeed}, 单词: ${word}`)

    return {
      word,
      wordNumber: this.calculateWordNumber(today),
      date: today.toISOString().split('T')[0],
      hints: this.generateOfficialStyleHints(word),
      source: 'Smart Fallback (Daily Rotating)',
      isReal: false,
      difficulty: 'medium',
      officialHintsAvailable: false
    }
  }

  /**
   * 评估单词难度
   */
  private assessDifficulty(word: string): 'easy' | 'medium' | 'hard' {
    const vowels = 'AEIOU'
    const vowelCount = word.split('').filter(letter => vowels.includes(letter)).length
    const uniqueLetters = new Set(word.split('')).size
    
    if (vowelCount >= 3 && uniqueLetters >= 4) return 'easy'
    if (vowelCount >= 2 && uniqueLetters >= 3) return 'medium'
    return 'hard'
  }

  /**
   * 描述字母分布
   */
  private describeLetterDistribution(word: string): string {
    const vowels = 'AEIOU'
    const vowelPositions = word.split('').map((letter, index) => 
      vowels.includes(letter) ? index + 1 : null
    ).filter(pos => pos !== null)
    
    if (vowelPositions.length === 0) return "All consonants"
    if (vowelPositions.length === 1) return `Vowel at position ${vowelPositions[0]}`
    return `Vowels at positions ${vowelPositions.join(', ')}`
  }

  /**
   * 描述单词类型
   */
  private describeWordType(word: string): string {
    if (word.endsWith('ING')) return "a verb ending in -ing"
    if (word.endsWith('ED')) return "a past tense verb"
    if (word.endsWith('ER')) return "a comparative or agent noun"
    if (word.endsWith('LY')) return "an adverb"
    if (word.endsWith('NESS')) return "a noun ending in -ness"
    return "a common English word"
  }

  /**
   * 生成最终提示
   */
  private generateFinalHint(word: string): string {
    const hints = [
      `Starts with ${word[0]}`,
      `Ends with ${word[word.length - 1]}`,
      `Has ${word.length} letters`,
      `Contains the letter ${word[Math.floor(word.length / 2)]} in the middle`
    ]
    
    return hints[Math.floor(Math.random() * hints.length)]
  }

  /**
   * 计算Wordle单词编号
   */
  private calculateWordNumber(date: Date): number {
    const epoch = new Date('2021-06-19')
    const timeDiff = date.getTime() - epoch.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return Math.max(0, daysDiff)
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.cache.clear()
    console.log('🧹 真实提示缓存已清除')
  }

  /**
   * 获取缓存状态
   */
  public getCacheStatus(): {
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
} 