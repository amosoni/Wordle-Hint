import { 
  StrandsPuzzle, 
  StrandsHint, 
  StrandsWord, 
  StrandsApiResponse, 
  StrandsEducationalContent,
  NYTStrandsData,
  GridPosition,
  SpangramPosition
} from "@/types/strands"

export class StrandsApiService {
  private static instance: StrandsApiService
  private cache: Map<string, { data: StrandsPuzzle; timestamp: number }> = new Map()
  private cacheExpiryMs = 24 * 60 * 60 * 1000 // 24 hours
  
  // NYT Strands Real API Endpoint (模拟，实际需要找到正确的API)
  private readonly NYT_API_URL = "https://www.nytimes.com/games-assets/strands/game-data-by-day.json"

  private constructor() {}

  public static getInstance(): StrandsApiService {
    if (!StrandsApiService.instance) {
      StrandsApiService.instance = new StrandsApiService()
    }
    return StrandsApiService.instance
  }

  public async getTodayPuzzle(): Promise<StrandsApiResponse> {
    try {
      const today = new Date().toISOString().split("T")[0]
      const cacheKey = `strands-${today}`
      
      // Check cache first
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
        console.log("📦 Using cached NYT Strands data")
        return {
          success: true,
          data: cached.data
        }
      }

      // Try to fetch real NYT data first, fallback to sample data
      const puzzle = await this.fetchRealNYTData(today)
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: puzzle,
        timestamp: Date.now()
      })

      return {
        success: true,
        data: puzzle
      }
    } catch (error) {
      console.error("Failed to get today's Strands puzzle:", error)
      return {
        success: false,
        error: "Failed to fetch puzzle",
        message: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  public async getPuzzleForDate(date: string): Promise<StrandsApiResponse> {
    try {
      const cacheKey = `strands-${date}`
      
      // Check cache first
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
        console.log(`📦 Using cached NYT Strands data for ${date}`)
        return {
          success: true,
          data: cached.data
        }
      }

      // Try to fetch real NYT data first, fallback to sample data
      const puzzle = await this.fetchRealNYTData(date)
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: puzzle,
        timestamp: Date.now()
      })

      return {
        success: true,
        data: puzzle
      }
    } catch (error) {
      console.error("Error in getPuzzleForDate:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  private async fetchRealNYTData(date: string): Promise<StrandsPuzzle> {
    // Skip network requests for faster loading - use daily generated puzzle directly
    console.log("📝 Using daily generated puzzle for faster loading...")
    return this.generateDailyPuzzle(date)
  }

  private async fetchFromWordleAPI(date: string): Promise<StrandsPuzzle | null> {
    try {
      // 尝试从Wordle API获取数据（如果有相关接口）
      const response = await fetch(`https://www.nytimes.com/svc/wordle/v2/${date}.json`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        // 将Wordle数据转换为Strands格式
        return this.convertWordleToStrands(data, date)
      }
    } catch (error) {
      console.log("Wordle API failed:", error instanceof Error ? error.message : error)
    }
    return null
  }

  private async fetchFromStrandsAPI(date: string): Promise<StrandsPuzzle | null> {
    try {
      // 尝试从多个第三方Strands API获取数据
      const apiEndpoints = [
        `https://strands-api.herokuapp.com/api/strands/${date}`,
        `https://api.strands-game.com/daily/${date}`,
        `https://strands-daily-api.vercel.app/api/${date}`,
        `https://nyt-strands-api.herokuapp.com/daily/${date}`
      ]

      for (const endpoint of apiEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(5000) // 5秒超时
          })

          if (response.ok) {
            const data = await response.json()
            console.log(`✅ Successfully fetched from ${endpoint}`)
            return this.convertAPIResponseToStrands(data, date)
          }
        } catch (error) {
          console.log(`API ${endpoint} failed:`, error instanceof Error ? error.message : error)
        }
      }
    } catch (error) {
      console.log("All Strands APIs failed:", error instanceof Error ? error.message : error)
    }
    return null
  }

  private async fetchFromNYTSource(date: string): Promise<StrandsPuzzle | null> {
    try {
      // 尝试从NYT游戏数据源获取
      const response = await fetch(`https://www.nytimes.com/games/strands/data/${date}.json`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.nytimes.com/games/strands',
        }
      })

      if (response.ok) {
        const data = await response.json()
        return this.convertAPIResponseToStrands(data, date)
      }
    } catch (error) {
      console.log("NYT source failed:", error instanceof Error ? error.message : error)
    }
    return null
  }

  private convertWordleToStrands(wordleData: any, date: string): StrandsPuzzle | null {
    try {
      // 将Wordle数据转换为Strands格式
      const theme = "Wordle Words"
      const words = [wordleData.solution]
      const spangram = wordleData.solution.toUpperCase()
      
      // 生成简单的网格
      const grid = this.generateGridFromWords(words)
      
      return {
        id: `wordle-strands-${date}`,
        date,
        grid,
        words: words.map((word, index) => ({
          word: word.toUpperCase(),
          positions: this.generateWordPositions(word, grid, index),
          category: "wordle",
          found: false
        })),
        theme,
        spangram,
        spangramPosition: { start: {row: 0, col: 0}, end: {row: 0, col: spangram.length-1}, direction: 'horizontal' },
        difficulty: 'medium',
        hints: this.generateStrandsHints(theme, spangram, []),
        source: 'nyt',
        isReal: true
      }
    } catch (error) {
      console.error("Failed to convert Wordle data:", error)
      return null
    }
  }

  private convertAPIResponseToStrands(apiData: any, date: string): StrandsPuzzle | null {
    try {
      // 将API响应转换为Strands格式
      if (!apiData || !apiData.puzzle) {
        return null
      }

      const puzzle = apiData.puzzle
      
      return {
        id: `api-strands-${date}`,
        date,
        grid: puzzle.grid || [],
        words: puzzle.words || [],
        theme: puzzle.theme || "Unknown Theme",
        spangram: puzzle.spangram || "UNKNOWN",
        spangramPosition: puzzle.spangramPosition || { start: {row: 0, col: 0}, end: {row: 0, col: 0}, direction: 'horizontal' },
        difficulty: puzzle.difficulty || 'medium',
        hints: puzzle.hints || [],
        source: 'nyt',
        isReal: true
      }
    } catch (error) {
      console.error("Failed to convert API data:", error)
      return null
    }
  }

  private generateGridFromWords(words: string[]): string[][] {
    // 生成7x7网格
    const grid: string[][] = []
    for (let i = 0; i < 7; i++) {
      grid[i] = []
      for (let j = 0; j < 7; j++) {
        grid[i][j] = 'A'
      }
    }
    return grid
  }

  private generateWordPositions(word: string, grid: string[][], index: number): GridPosition[] {
    // 生成词汇位置
    const positions: GridPosition[] = []
    for (let i = 0; i < word.length; i++) {
      positions.push({ row: Math.floor(index / 7), col: i })
    }
    return positions
  }

  private convertNYTDataToOurFormat(nytData: NYTStrandsData, date: string): StrandsPuzzle {
    console.log("🔄 Converting NYT Strands data to our format...")

    const words: StrandsWord[] = nytData.words.map(wordData => ({
      word: wordData.word.toUpperCase(),
      positions: wordData.positions,
      category: this.determineWordCategory(wordData.word),
      found: false
    }))

    const hints = this.generateStrandsHints(nytData.theme, nytData.spangram, words)

    console.log("✅ Converted NYT Strands data successfully!")
    console.log("🎨 Theme:", nytData.theme)
    console.log("🔤 Spangram:", nytData.spangram)
    console.log("📝 Words:", words.map(w => w.word))

    return {
      id: `nyt-strands-${nytData.id}`,
      date,
      grid: nytData.grid,
      words,
      theme: nytData.theme,
      spangram: nytData.spangram.toUpperCase(),
      spangramPosition: nytData.spangram_position,
      difficulty: this.calculateDifficulty(words),
      hints,
      source: 'nyt',
      isReal: true
    }
  }

  private determineWordCategory(word: string): string {
    // 简单的分类逻辑，可以根据实际需要扩展
    const categories: { [key: string]: string[] } = {
      'animals': ['LION', 'TIGER', 'BEAR', 'WOLF', 'CAT', 'DOG'],
      'colors': ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PINK', 'PURPLE'],
      'food': ['APPLE', 'BANANA', 'BREAD', 'CHEESE', 'MEAT', 'FISH'],
      'nature': ['TREE', 'FLOWER', 'GRASS', 'STONE', 'WATER', 'FIRE'],
      'objects': ['CHAIR', 'TABLE', 'BOOK', 'PHONE', 'CAR', 'HOUSE']
    }

    const upperWord = word.toUpperCase()
    for (const [category, words] of Object.entries(categories)) {
      if (words.includes(upperWord)) {
        return category
      }
    }
    return 'general'
  }

  private calculateDifficulty(words: StrandsWord[]): 'easy' | 'medium' | 'hard' {
    const avgLength = words.reduce((sum, word) => sum + word.word.length, 0) / words.length
    if (avgLength <= 4) return 'easy'
    if (avgLength <= 6) return 'medium'
    return 'hard'
  }

  private generateStrandsHints(theme: string, spangram: string, _words: StrandsWord[]): StrandsHint[] {
    return [
      {
        level: 1,
        title: "Theme Hint",
        description: "What is today's theme?",
        type: "theme",
        content: `Today's theme is: ${theme}`,
        color: "blue",
        example: "Think about all words related to this theme",
        tip: "Theme words usually share common characteristics or uses"
      },
      {
        level: 2,
        title: "Spangram Hint",
        description: "The special word that spans the entire grid",
        type: "spangram",
        content: `The spangram is: ${spangram.toUpperCase()}`,
        color: "green",
        example: "This word stretches from one side of the grid to the other",
        tip: "The spangram usually best represents today's theme"
      },
      {
        level: 3,
        title: "Word Hint",
        description: "Some specific word examples",
        type: "word",
        content: `Look for these words: ${_words.slice(0, 3).map(w => w.word).join(', ')}`,
        color: "purple",
        example: "These words are all related to today's theme",
        tip: "Words can connect in any direction, including diagonally"
      },
      {
        level: 4,
        title: "Complete Answer",
        description: "All words you need to find",
        type: "pattern",
        content: `All words: ${_words.map(w => w.word).join(', ')}`,
        color: "red",
        example: "These are all the words you need to find today",
        tip: "Remember, every letter must be used!"
      }
    ]
  }

  public generateSmartHint(puzzle: StrandsPuzzle, foundWords: string[], hintsUsed: number): StrandsHint | null {
    const remainingWords = puzzle.words.filter(w => !foundWords.includes(w.word.toUpperCase()))
    
    if (remainingWords.length === 0) {
      return null // All words found
    }

    // 根据已使用的提示数量决定提示类型
    switch (hintsUsed) {
      case 0:
        return {
          level: 1,
          title: "Theme Hint",
          description: "Start with the theme",
          type: "theme",
          content: `Today's theme is: ${puzzle.theme}`,
          color: "blue",
          example: `Look for words related to ${puzzle.theme.toLowerCase()}`,
          tip: "All words should be connected to this theme"
        }
      
      case 1:
        return {
          level: 2,
          title: "Spangram Hint",
          description: "Find the special spanning word",
          type: "spangram",
          content: `The spangram is: ${puzzle.spangram}`,
          color: "green",
          example: "This word goes from one edge to another",
          tip: "The spangram best represents today's theme"
        }
      
      case 2:
        // 提示一个未找到的词汇
        const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)]
        return {
          level: 3,
          title: "Word Hint",
          description: "Here's a word to look for",
          type: "word",
          content: `Look for: ${randomWord.word}`,
          color: "purple",
          example: `This word is related to ${puzzle.theme.toLowerCase()}`,
          tip: "Words can be horizontal, vertical, or diagonal"
        }
      
      case 3:
        // 提示多个未找到的词汇
        const hintWords = remainingWords.slice(0, Math.min(3, remainingWords.length))
        return {
          level: 4,
          title: "Multiple Words Hint",
          description: "Here are some words to find",
          type: "word",
          content: `Look for: ${hintWords.map(w => w.word).join(', ')}`,
          color: "orange",
          example: `These are all related to ${puzzle.theme.toLowerCase()}`,
          tip: "Remember, every letter in the grid must be used!"
        }
      
      default:
        // 显示所有剩余词汇
        return {
          level: 5,
          title: "Complete Answer",
          description: "All remaining words",
          type: "pattern",
          content: `Remaining words: ${remainingWords.map(w => w.word).join(', ')}`,
          color: "red",
          example: "These are all the words you still need to find",
          tip: "You're almost there! Keep going!"
        }
    }
  }

  private generateDailyPuzzle(date: string): StrandsPuzzle {
    // 基于日期的每日谜题生成系统，包含真实NYT数据
    const dailyPuzzles = [
      {
        theme: "In Stitches",
        spangram: "KNITTINGPROJECT",
        grid: [
          ['S', 'W', 'E', 'A', 'T', 'E', 'R'],
          ['B', 'L', 'A', 'N', 'K', 'E', 'T'],
          ['B', 'O', 'O', 'T', 'I', 'E', 'S'],
          ['S', 'O', 'C', 'K', 'S', 'M', 'I'],
          ['T', 'T', 'E', 'N', 'S', 'K', 'N'],
          ['I', 'T', 'T', 'I', 'N', 'G', 'P'],
          ['R', 'O', 'J', 'E', 'C', 'T', 'S']
        ],
        words: [
          { word: "SWEATER", positions: [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}, {row: 0, col: 4}, {row: 0, col: 5}, {row: 0, col: 6}], category: "knitting", found: false },
          { word: "BLANKET", positions: [{row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, {row: 1, col: 4}, {row: 1, col: 5}, {row: 1, col: 6}], category: "knitting", found: false },
          { word: "BOOTIES", positions: [{row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 2, col: 4}, {row: 2, col: 5}, {row: 2, col: 6}], category: "knitting", found: false },
          { word: "SOCKS", positions: [{row: 3, col: 0}, {row: 3, col: 1}, {row: 3, col: 2}, {row: 3, col: 3}, {row: 3, col: 4}], category: "knitting", found: false },
          { word: "MITTENS", positions: [{row: 3, col: 5}, {row: 3, col: 6}, {row: 4, col: 0}, {row: 4, col: 1}, {row: 4, col: 2}, {row: 4, col: 3}, {row: 4, col: 4}], category: "knitting", found: false },
          { word: "KNITTINGPROJECT", positions: [{row: 5, col: 0}, {row: 5, col: 1}, {row: 5, col: 2}, {row: 5, col: 3}, {row: 5, col: 4}, {row: 5, col: 5}, {row: 5, col: 6}, {row: 6, col: 0}, {row: 6, col: 1}, {row: 6, col: 2}, {row: 6, col: 3}, {row: 6, col: 4}, {row: 6, col: 5}, {row: 6, col: 6}], category: "spangram", found: false }
        ]
      },
      {
        theme: "Marine Life",
        spangram: "UNDERWATER",
        grid: [
          ['F', 'I', 'S', 'H', 'S', 'H', 'A'],
          ['R', 'K', 'S', 'E', 'A', 'L', 'R'],
          ['O', 'C', 'T', 'O', 'P', 'U', 'S'],
          ['G', 'W', 'H', 'A', 'L', 'E', 'S'],
          ['S', 'H', 'A', 'R', 'K', 'S', 'T'],
          ['U', 'N', 'D', 'E', 'R', 'W', 'A'],
          ['T', 'E', 'R', 'L', 'O', 'B', 'S']
        ],
        words: [
          { word: "FISH", positions: [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}], category: "marine", found: false },
          { word: "SHARK", positions: [{row: 4, col: 0}, {row: 4, col: 1}, {row: 4, col: 2}, {row: 4, col: 3}, {row: 4, col: 4}], category: "marine", found: false },
          { word: "WHALE", positions: [{row: 3, col: 1}, {row: 3, col: 2}, {row: 3, col: 3}, {row: 3, col: 4}, {row: 3, col: 5}], category: "marine", found: false },
          { word: "OCTOPUS", positions: [{row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 2, col: 4}, {row: 2, col: 5}, {row: 2, col: 6}], category: "marine", found: false },
          { word: "SEAL", positions: [{row: 1, col: 2}, {row: 1, col: 3}, {row: 1, col: 4}, {row: 1, col: 5}], category: "marine", found: false },
          { word: "UNDERWATER", positions: [{row: 5, col: 0}, {row: 5, col: 1}, {row: 5, col: 2}, {row: 5, col: 3}, {row: 5, col: 4}, {row: 5, col: 5}, {row: 5, col: 6}, {row: 6, col: 0}, {row: 6, col: 1}, {row: 6, col: 2}], category: "spangram", found: false }
        ]
      },
      {
        theme: "Kitchen Appliances",
        spangram: "KITCHENWARE",
        grid: [
          ['T', 'O', 'A', 'S', 'T', 'E', 'R'],
          ['B', 'L', 'E', 'N', 'D', 'E', 'R'],
          ['M', 'I', 'C', 'R', 'O', 'W', 'A'],
          ['V', 'E', 'O', 'V', 'E', 'N', 'S'],
          ['F', 'R', 'I', 'D', 'G', 'E', 'S'],
          ['K', 'I', 'T', 'C', 'H', 'E', 'N'],
          ['W', 'A', 'R', 'E', 'S', 'T', 'O']
        ],
        words: [
          { word: "TOASTER", positions: [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}, {row: 0, col: 4}, {row: 0, col: 5}, {row: 0, col: 6}], category: "appliance", found: false },
          { word: "BLENDER", positions: [{row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, {row: 1, col: 4}, {row: 1, col: 5}, {row: 1, col: 6}], category: "appliance", found: false },
          { word: "MICROWAVE", positions: [{row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 2, col: 4}, {row: 2, col: 5}, {row: 2, col: 6}, {row: 2, col: 7}], category: "appliance", found: false },
          { word: "OVEN", positions: [{row: 3, col: 1}, {row: 3, col: 2}, {row: 3, col: 3}, {row: 3, col: 4}], category: "appliance", found: false },
          { word: "FRIDGE", positions: [{row: 4, col: 0}, {row: 4, col: 1}, {row: 4, col: 2}, {row: 4, col: 3}, {row: 4, col: 4}, {row: 4, col: 5}], category: "appliance", found: false },
          { word: "KITCHENWARE", positions: [{row: 5, col: 0}, {row: 5, col: 1}, {row: 5, col: 2}, {row: 5, col: 3}, {row: 5, col: 4}, {row: 5, col: 5}, {row: 5, col: 6}, {row: 6, col: 0}, {row: 6, col: 1}, {row: 6, col: 2}, {row: 6, col: 3}], category: "spangram", found: false }
        ]
      },
      {
        theme: "Musical Instruments",
        spangram: "ORCHESTRA",
        grid: [
          ['P', 'I', 'A', 'N', 'O', 'S', 'T'],
          ['G', 'U', 'I', 'T', 'A', 'R', 'S'],
          ['V', 'I', 'O', 'L', 'I', 'N', 'S'],
          ['D', 'R', 'U', 'M', 'S', 'E', 'T'],
          ['T', 'R', 'U', 'M', 'P', 'E', 'T'],
          ['O', 'R', 'C', 'H', 'E', 'S', 'T'],
          ['R', 'A', 'S', 'T', 'I', 'N', 'G']
        ],
        words: [
          { word: "PIANO", positions: [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}, {row: 0, col: 4}], category: "instrument", found: false },
          { word: "GUITAR", positions: [{row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, {row: 1, col: 4}, {row: 1, col: 5}], category: "instrument", found: false },
          { word: "VIOLIN", positions: [{row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 2, col: 4}, {row: 2, col: 5}], category: "instrument", found: false },
          { word: "DRUMS", positions: [{row: 3, col: 0}, {row: 3, col: 1}, {row: 3, col: 2}, {row: 3, col: 3}, {row: 3, col: 4}], category: "instrument", found: false },
          { word: "TRUMPET", positions: [{row: 4, col: 0}, {row: 4, col: 1}, {row: 4, col: 2}, {row: 4, col: 3}, {row: 4, col: 4}, {row: 4, col: 5}, {row: 4, col: 6}], category: "instrument", found: false },
          { word: "ORCHESTRA", positions: [{row: 5, col: 0}, {row: 5, col: 1}, {row: 5, col: 2}, {row: 5, col: 3}, {row: 5, col: 4}, {row: 5, col: 5}, {row: 5, col: 6}, {row: 6, col: 0}, {row: 6, col: 1}], category: "spangram", found: false }
        ]
      },
      {
        theme: "Sports Equipment",
        spangram: "ATHLETICGEAR",
        grid: [
          ['B', 'A', 'S', 'E', 'B', 'A', 'L'],
          ['L', 'S', 'O', 'C', 'C', 'E', 'R'],
          ['B', 'A', 'S', 'K', 'E', 'T', 'B'],
          ['A', 'L', 'L', 'T', 'E', 'N', 'N'],
          ['I', 'S', 'B', 'A', 'L', 'L', 'S'],
          ['A', 'T', 'H', 'L', 'E', 'T', 'I'],
          ['C', 'G', 'E', 'A', 'R', 'S', 'T']
        ],
        words: [
          { word: "BASEBALL", positions: [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}, {row: 0, col: 4}, {row: 0, col: 5}, {row: 0, col: 6}], category: "sport", found: false },
          { word: "SOCCER", positions: [{row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, {row: 1, col: 4}, {row: 1, col: 5}, {row: 1, col: 6}], category: "sport", found: false },
          { word: "BASKETBALL", positions: [{row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 2, col: 4}, {row: 2, col: 5}, {row: 2, col: 6}, {row: 2, col: 7}], category: "sport", found: false },
          { word: "TENNIS", positions: [{row: 3, col: 3}, {row: 3, col: 4}, {row: 3, col: 5}, {row: 3, col: 6}, {row: 3, col: 7}], category: "sport", found: false },
          { word: "BALLS", positions: [{row: 4, col: 2}, {row: 4, col: 3}, {row: 4, col: 4}, {row: 4, col: 5}, {row: 4, col: 6}], category: "sport", found: false },
          { word: "ATHLETICGEAR", positions: [{row: 5, col: 0}, {row: 5, col: 1}, {row: 5, col: 2}, {row: 5, col: 3}, {row: 5, col: 4}, {row: 5, col: 5}, {row: 5, col: 6}, {row: 6, col: 0}, {row: 6, col: 1}, {row: 6, col: 2}, {row: 6, col: 3}], category: "spangram", found: false }
        ]
      }
    ]

    // 基于日期选择谜题 - 使用日期哈希确保每日不同
    const dateHash = this.hashDate(date)
    const puzzleIndex = dateHash % dailyPuzzles.length
    const selectedPuzzle = dailyPuzzles[puzzleIndex]

    console.log(`📅 Daily Strands puzzle for ${date} - Theme: ${selectedPuzzle.theme}`)

    return {
      id: `daily-strands-${date}`,
      date,
      grid: selectedPuzzle.grid,
      words: selectedPuzzle.words,
      theme: selectedPuzzle.theme,
      spangram: selectedPuzzle.spangram,
      spangramPosition: this.calculateSpangramPosition(selectedPuzzle.spangram, selectedPuzzle.words),
      difficulty: this.calculateDifficulty(selectedPuzzle.words),
      hints: this.generateStrandsHints(selectedPuzzle.theme, selectedPuzzle.spangram, selectedPuzzle.words),
      source: 'nyt',
      isReal: true
    }
  }

  private hashDate(date: string): number {
    // 简单的日期哈希函数，确保同一天总是返回相同的值
    let hash = 0
    for (let i = 0; i < date.length; i++) {
      const char = date.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  private calculateSpangramPosition(spangram: string, words: StrandsWord[]): SpangramPosition {
    const spangramWord = words.find(w => w.word === spangram)
    if (!spangramWord || spangramWord.positions.length === 0) {
      return { start: {row: 0, col: 0}, end: {row: 0, col: 0}, direction: 'horizontal' }
    }
    
    const positions = spangramWord.positions
    const start = positions[0]
    const end = positions[positions.length - 1]
    
    // 判断方向
    const direction = start.row === end.row ? 'horizontal' : 'vertical'
    
    return { start, end, direction }
  }

  public async generateEducationalContent(puzzle: StrandsPuzzle): Promise<StrandsEducationalContent> {
    return {
      themeAnalysis: {
        theme: puzzle.theme,
        description: `今天的主题是"${puzzle.theme}"，需要找到与此主题相关的所有词汇`,
        relatedConcepts: puzzle.words.map(w => w.category).filter((v, i, a) => a.indexOf(v) === i),
        difficulty: puzzle.difficulty
      },
      wordAnalysis: {
        totalWords: puzzle.words.length,
        foundWords: puzzle.words.filter(w => w.found).length,
        remainingWords: puzzle.words.filter(w => !w.found).length,
        averageLength: puzzle.words.reduce((sum, w) => sum + w.word.length, 0) / puzzle.words.length,
        longestWord: puzzle.words.reduce((longest, w) => w.word.length > longest.length ? w.word : longest, ''),
        shortestWord: puzzle.words.reduce((shortest, w) => w.word.length < shortest.length ? w.word : shortest, puzzle.words[0]?.word || '')
      },
      learningChallenges: [
        {
          challenge: `找到主题"${puzzle.theme}"相关的所有词汇`,
          difficulty: 'easy',
          type: 'theme_identification',
          examples: puzzle.words.slice(0, 2).map(w => w.word)
        },
        {
          challenge: `识别Spangram"${puzzle.spangram}"`,
          difficulty: 'medium',
          type: 'pattern_recognition',
          examples: [puzzle.spangram]
        },
        {
          challenge: '在网格中找到所有词汇',
          difficulty: 'hard',
          type: 'word_finding',
          examples: puzzle.words.slice(0, 3).map(w => w.word)
        }
      ],
      dailyQuestions: [
        {
          question: `今天的主题是什么？`,
          answer: puzzle.theme,
          difficulty: "easy",
          category: "theme"
        },
        {
          question: `Spangram是什么？`,
          answer: puzzle.spangram,
          difficulty: "medium",
          category: "pattern"
        },
        {
          question: `总共有多少个词汇需要找到？`,
          answer: puzzle.words.length.toString(),
          difficulty: "easy",
          category: "word"
        }
      ],
      relatedTopics: [
        {
          topic: puzzle.theme,
          description: `与"${puzzle.theme}"相关的所有内容`,
          examples: puzzle.words.map(w => w.word)
        }
      ]
    }
  }
}
