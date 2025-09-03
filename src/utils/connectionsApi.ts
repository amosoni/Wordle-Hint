import { ConnectionsPuzzle, ConnectionsHint, ConnectionsCategory, ConnectionsEducationalContent } from "@/types/connections"

export interface ConnectionsApiResponse {
  success: boolean
  data?: ConnectionsPuzzle
  error?: string
  message?: string
}

// NYT Connections Real Data Interface
interface NYTConnectionsData {
  id: number
  print_date: string
  groups: Array<{
    group_name: string
    members: string[]
  }>
}

export class ConnectionsApiService {
  private static instance: ConnectionsApiService
  private cache: Map<string, { data: ConnectionsPuzzle; timestamp: number }> = new Map()
  private cacheExpiryMs = 24 * 60 * 60 * 1000 // 24 hours
  
  // NYT Connections Real API Endpoint
  private readonly NYT_API_URL = "https://www.nytimes.com/games-assets/connections/game-data-by-day.json"

  private constructor() {}

  public static getInstance(): ConnectionsApiService {
    if (!ConnectionsApiService.instance) {
      ConnectionsApiService.instance = new ConnectionsApiService()
    }
    return ConnectionsApiService.instance
  }

  public async getTodayPuzzle(): Promise<ConnectionsApiResponse> {
    try {
      const today = new Date().toISOString().split("T")[0]
      const cacheKey = `connections-${today}`
      
      // Check cache first
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < this.cacheExpiryMs) {
        console.log("📦 Using cached NYT Connections data")
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
      console.error("Failed to get today's Connections puzzle:", error)
      return {
        success: false,
        error: "Failed to fetch puzzle",
        message: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  private async fetchRealNYTData(date: string): Promise<ConnectionsPuzzle> {
    try {
      console.log("🔍 Attempting to fetch real NYT Connections data...")
      
      // Try to fetch from NYT API with proper headers
      const response = await fetch(this.NYT_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.nytimes.com/games/connections',
          'Origin': 'https://www.nytimes.com'
        },
        mode: 'cors'
      })

      if (response.ok) {
        const allData = await response.json()
        console.log("✅ Successfully fetched NYT Connections data!")
        
        // Calculate today's puzzle number (days since Connections launch: June 12, 2023)
        const launchDate = new Date('2023-06-12')
        const today = new Date(date)
        const daysDiff = Math.floor((today.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24))
        
        console.log(` Days since launch: ${daysDiff}`)
        
        // Find today's puzzle in the data
        const todaysPuzzle = allData[daysDiff] || allData[Object.keys(allData)[Object.keys(allData).length - 1]]
        
        if (todaysPuzzle && todaysPuzzle.groups) {
          console.log("🎯 Found today's puzzle:", todaysPuzzle)
          return this.convertNYTDataToOurFormat(todaysPuzzle, date)
        }
      }
      
      console.log("⚠️ NYT API response not OK, using enhanced sample data...")
      return this.generateEnhancedSamplePuzzle(date)
      
    } catch (error) {
      console.error("❌ Error fetching NYT data:", error)
      console.log("📝 Falling back to enhanced sample data...")
      return this.generateEnhancedSamplePuzzle(date)
    }
  }

  private convertNYTDataToOurFormat(nytData: NYTConnectionsData, date: string): ConnectionsPuzzle {
    const colors = ['yellow', 'green', 'blue', 'purple'] as const
    const categories: ConnectionsCategory[] = []
    const allWords: string[] = []

    console.log("🔄 Converting NYT data to our format...")

    // Convert NYT groups to our format
    nytData.groups.map(({ group_name, members }) => {
      const category: ConnectionsCategory = {
        name: group_name.toUpperCase(),
        words: members.map(word => word.toUpperCase()),
        color: colors[members.length - 1] || 'yellow', // Assign color based on number of members
        difficulty: members.length, // Difficulty based on number of words
        description: this.generateCategoryDescription(group_name),
        explanation: `These words are all related to ${group_name.toLowerCase()}`
      }
      categories.push(category)
      allWords.push(...category.words)
    })

    // Shuffle words for display
    const shuffledWords = this.shuffleArray([...allWords])

    console.log("✅ Converted NYT data successfully!")
    console.log("📊 Categories:", categories.map(c => c.name))
    console.log("🔤 Words:", shuffledWords)

    return {
      id: `nyt-connections-${nytData.id}`,
      date,
      words: shuffledWords,
      categories,
      difficulty: 'blue',
      hints: this.generateRealHints(categories),
      source: 'nyt',
      isReal: true
    }
  }

  private generateCategoryDescription(groupName: string): string {
    // Generate intelligent descriptions based on the category
    const descriptions: { [key: string]: string } = {
      'fish': 'Types of fish',
      'colors': 'Basic colors',
      'directions': 'Cardinal directions',
      'elements': 'Classical elements',
      'animals': 'Types of animals',
      'food': 'Types of food',
      'sports': 'Sports and games',
      'music': 'Musical terms',
      'movies': 'Film-related terms',
      'books': 'Literature references',
      'brands': 'Brand names',
      'countries': 'Country names',
      'cities': 'City names',
      'professions': 'Job titles',
      'body parts': 'Human anatomy',
      'vehicles': 'Transportation',
      'tools': 'Hand tools',
      'instruments': 'Musical instruments',
      'flowers': 'Plant names',
      'trees': 'Tree species'
    }

    const lowerName = groupName.toLowerCase()
    for (const key in descriptions) {
      if (lowerName.includes(key)) {
        return descriptions[key]
      }
    }

    return `Things related to ${groupName.toLowerCase()}`
  }

  private generateRealHints(categories: ConnectionsCategory[]): ConnectionsHint[] {
    return [
      {
        level: 1,
        title: "Category Clue",
        description: "Think about what these words have in common",
        type: "category",
        content: `One group contains words related to ${categories[0]?.name.toLowerCase()}`,
        color: "blue",
        example: `Look for ${categories[0]?.words[0]} and similar items`,
        tip: "Start with the most obvious connections first"
      },
      {
        level: 2,
        title: "Word Association",
        description: "Consider different meanings and contexts",
        type: "word",
        content: `Another group focuses on ${categories[1]?.name.toLowerCase()}`,
        color: "green",
        example: `Think about how ${categories[1]?.words[0]} relates to the others`,
        tip: "Some words might have multiple meanings - consider all possibilities"
      },
      {
        level: 3,
        title: "Pattern Recognition",
        description: "Look for less obvious connections",
        type: "pattern",
        content: `The third group involves ${categories[2]?.name.toLowerCase()}`,
        color: "purple",
        example: `${categories[2]?.words[0]} belongs with similar concepts`,
        tip: "Think about abstract or thematic connections"
      },
      {
        level: 4,
        title: "Final Group",
        description: "The most challenging connection",
        type: "direct",
        content: `The last group: ${categories[3]?.name} - ${categories[3]?.words.join(', ')}`,
        color: "red",
        example: "These are the remaining four words",
        tip: "This is usually the trickiest category - think outside the box!"
      }
    ]
  }

  private generateEnhancedSamplePuzzle(date: string): ConnectionsPuzzle {
    // Enhanced sample puzzles with variety
    const samplePuzzles = [
      {
        words: ["BASS", "FLOUNDER", "SALMON", "TROUT", "FIRE", "WATER", "EARTH", "AIR", "RED", "BLUE", "GREEN", "YELLOW", "NORTH", "SOUTH", "EAST", "WEST"],
        categories: [
          { name: "FISH", words: ["BASS", "FLOUNDER", "SALMON", "TROUT"], color: "yellow", difficulty: 1, description: "Types of fish" },
          { name: "CLASSICAL ELEMENTS", words: ["FIRE", "WATER", "EARTH", "AIR"], color: "green", difficulty: 2, description: "Four classical elements" },
          { name: "PRIMARY COLORS", words: ["RED", "BLUE", "GREEN", "YELLOW"], color: "blue", difficulty: 3, description: "Basic colors" },
          { name: "CARDINAL DIRECTIONS", words: ["NORTH", "SOUTH", "EAST", "WEST"], color: "purple", difficulty: 4, description: "Compass directions" }
        ]
      },
      {
        words: ["APPLE", "ORANGE", "BANANA", "GRAPE", "PIANO", "GUITAR", "VIOLIN", "DRUMS", "SOCCER", "TENNIS", "GOLF", "HOCKEY", "CHAIR", "TABLE", "SOFA", "DESK"],
        categories: [
          { name: "FRUITS", words: ["APPLE", "ORANGE", "BANANA", "GRAPE"], color: "yellow", difficulty: 1, description: "Types of fruit" },
          { name: "MUSICAL INSTRUMENTS", words: ["PIANO", "GUITAR", "VIOLIN", "DRUMS"], color: "green", difficulty: 2, description: "Instruments you can play" },
          { name: "SPORTS", words: ["SOCCER", "TENNIS", "GOLF", "HOCKEY"], color: "blue", difficulty: 3, description: "Athletic activities" },
          { name: "FURNITURE", words: ["CHAIR", "TABLE", "SOFA", "DESK"], color: "purple", difficulty: 4, description: "Home furnishings" }
        ]
      },
      {
        words: ["LION", "TIGER", "BEAR", "WOLF", "PEN", "PENCIL", "MARKER", "CRAYON", "CAR", "TRUCK", "BUS", "VAN", "SUN", "MOON", "STAR", "PLANET"],
        categories: [
          { name: "ANIMALS", words: ["LION", "TIGER", "BEAR", "WOLF"], color: "yellow", difficulty: 1, description: "Wild animals" },
          { name: "WRITING TOOLS", words: ["PEN", "PENCIL", "MARKER", "CRAYON"], color: "green", difficulty: 2, description: "Tools for writing" },
          { name: "VEHICLES", words: ["CAR", "TRUCK", "BUS", "VAN"], color: "blue", difficulty: 3, description: "Transportation" },
          { name: "CELESTIAL BODIES", words: ["SUN", "MOON", "STAR", "PLANET"], color: "purple", difficulty: 4, description: "Objects in space" }
        ]
      }
    ]

    // Select puzzle based on date
    const dayOfYear = new Date(date).getTime()
    const puzzleIndex = Math.floor(dayOfYear / (1000 * 60 * 60 * 24)) % samplePuzzles.length
    const selectedPuzzle = samplePuzzles[puzzleIndex]

    console.log(`📝 Using enhanced sample puzzle ${puzzleIndex + 1}`)

    return {
      id: `sample-connections-${date}`,
      date,
      words: this.shuffleArray([...selectedPuzzle.words]),
      categories: selectedPuzzle.categories as ConnectionsCategory[],
      difficulty: "blue",
      hints: this.generateRealHints(selectedPuzzle.categories as ConnectionsCategory[]),
      source: "enhanced-sample",
      isReal: false
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  public async generateEducationalContent(puzzle: ConnectionsPuzzle): Promise<ConnectionsEducationalContent> {
    return {
      wordAnalysis: {
        commonWords: puzzle.words.filter(word => word.length <= 5),
        rareWords: puzzle.words.filter(word => word.length > 5),
        wordPatterns: puzzle.categories.map(cat => `${cat.name} words`),
        difficultyScore: puzzle.categories.reduce((acc, cat) => acc + cat.difficulty, 0) / 4
      },
      learningChallenges: puzzle.categories.map((category, index) => ({
        challenge: `Identify the ${category.name.toLowerCase()} category`,
        difficulty: index < 2 ? 'easy' : index < 3 ? 'medium' : 'hard',
        type: 'category_identification',
        examples: category.words.slice(0, 2)
      })),
      dailyQuestions: [
        {
          question: `Which category contains "${puzzle.categories[0]?.words[0]}"?`,
          answer: `${puzzle.categories[0]?.name} - ${puzzle.categories[0]?.description}`,
          difficulty: "easy",
          category: "pattern_recognition"
        },
        {
          question: `What's the connection between ${puzzle.categories[1]?.words.slice(0, 2).join(' and ')}?`,
          answer: `They are both ${puzzle.categories[1]?.description.toLowerCase()}`,
          difficulty: "medium",
          category: "word_association"
        }
      ],
      relatedTopics: puzzle.categories.map(category => ({
        topic: category.name,
        description: category.description,
        examples: category.words.slice(0, 3)
      }))
    }
  }
}
