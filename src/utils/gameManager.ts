import { Game, GameCategory, GameSearchParams } from '@/types/game'

export class GameManager {
  private static instance: GameManager
  private games: Map<string, Game> = new Map()
  private categories: Map<string, GameCategory> = new Map()

  private constructor() {
    this.initializeDefaultGames()
    this.initializeCategories()
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager()
    }
    return GameManager.instance
  }

  private initializeDefaultGames(): void {
    const wordleGame: Game = {
      id: 'wordle',
      name: 'wordle',
      title: 'Wordle',
      description: 'A daily word puzzle game where players have six attempts to guess a five-letter word.',
      category: 'Logic Games',
      subCategories: ['Games', 'Strategy Games', 'Logic Games', 'Wordle'],
      playCount: 4339388,
      rating: 3.2,
      voteCount: 3828,
      difficulty: 'Medium',
      estimatedTime: '5-10 minutes',
      tags: ['word puzzle', 'daily challenge', 'strategy', 'vocabulary'],
      imageUrl: '/images/games/wordle.png',
      gameUrl: '/games/wordle',
      isActive: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      achievements: [
        {
          id: 'first-word',
          name: 'First word',
          description: 'Play a game',
          icon: '🎯',
          progress: 0,
          maxProgress: 1,
          unlocked: false
        },
        {
          id: 'first-win',
          name: 'First win',
          description: 'Win for the first time',
          icon: '🏆',
          progress: 0,
          maxProgress: 1,
          unlocked: false
        },
        {
          id: 'persistence',
          name: 'Persistence',
          description: 'Play 15 games',
          icon: '🔥',
          progress: 0,
          maxProgress: 15,
          unlocked: false
        }
      ],
      highScores: []
    }

    this.games.set(wordleGame.id, wordleGame)
  }

  private initializeCategories(): void {
    const categories: GameCategory[] = [
      {
        id: 'strategy-games',
        name: 'Strategy Games',
        icon: '🎯',
        description: 'Games that require strategic thinking',
        gameCount: 15,
        isActive: true
      },
      {
        id: 'logic-games',
        name: 'Logic Games',
        icon: '🧩',
        description: 'Puzzle and logic-based games',
        gameCount: 23,
        isActive: true
      },
      {
        id: 'word-games',
        name: 'Word Games',
        icon: '📚',
        description: 'Vocabulary and language games',
        gameCount: 12,
        isActive: true
      }
    ]

    categories.forEach(category => {
      this.categories.set(category.id, category)
    })
  }

  public getAllGames(): Game[] {
    return Array.from(this.games.values())
  }

  public getGameById(id: string): Game | undefined {
    return this.games.get(id)
  }

  public getGamesByCategory(category: string): Game[] {
    return Array.from(this.games.values()).filter(game => 
      game.category === category || game.subCategories.includes(category)
    )
  }

  public searchGames(params: GameSearchParams): Game[] {
    let games = Array.from(this.games.values())

    if (params.category) {
      games = games.filter(game => 
        game.category === params.category || game.subCategories.includes(params.category!)
      )
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase()
      games = games.filter(game => 
        game.title.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower)
      )
    }

    if (params.featured !== undefined) {
      games = games.filter(game => game.featured === params.featured)
    }

    return games
  }

  public getFeaturedGames(): Game[] {
    return Array.from(this.games.values()).filter(game => game.featured)
  }

  public getAllCategories(): GameCategory[] {
    return Array.from(this.categories.values())
  }

  public addGame(game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Game {
    const newGame: Game = {
      ...game,
      id: this.generateGameId(game.name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.games.set(newGame.id, newGame)
    return newGame
  }

  public updateGame(id: string, updates: Partial<Game>): Game | null {
    const game = this.games.get(id)
    if (!game) return null

    const updatedGame: Game = {
      ...game,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.games.set(id, updatedGame)
    return updatedGame
  }

  public incrementPlayCount(id: string): boolean {
    const game = this.games.get(id)
    if (!game) return false

    game.playCount++
    game.updatedAt = new Date().toISOString()
    return true
  }

  public getGameStats(): Record<string, unknown> {
    const games = Array.from(this.games.values())
    const totalGames = games.length
    const totalPlays = games.reduce((sum, game) => sum + game.playCount, 0)
    const averageRating = games.reduce((sum, game) => sum + game.rating, 0) / totalGames

    return {
      totalGames,
      totalPlays,
      averageRating: Math.round(averageRating * 10) / 10,
      categories: this.getAllCategories().map(cat => ({
        ...cat,
        gameCount: this.getGamesByCategory(cat.name).length
      }))
    }
  }

  private generateGameId(name: string): string {
    const baseId = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    let id = baseId
    let counter = 1

    while (this.games.has(id)) {
      id = `${baseId}-${counter}`
      counter++
    }

    return id
  }
} 