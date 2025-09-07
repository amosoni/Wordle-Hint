import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = await request.json() as any
    const { 
      theme, 
      spangram, 
      words, 
      grid, 
      date = new Date().toISOString().split("T")[0] 
    } = body

    // 验证必需字段
    if (!theme || !spangram || !words || !grid) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: theme, spangram, words, grid"
      }, { status: 400 })
    }

    // 生成词汇位置
    const wordsWithPositions = words.map((word: string, index: number) => ({
      word: word.toUpperCase(),
      positions: generateWordPositions(word, grid, index),
      category: determineWordCategory(word),
      found: false
    }))

    // 生成Spangram位置
    const spangramPosition = generateSpangramPosition(spangram, wordsWithPositions)

    // 生成提示
    const hints = generateStrandsHints(theme, spangram, wordsWithPositions)

    const puzzle = {
      id: `manual-strands-${date}`,
      date,
      grid,
      words: wordsWithPositions,
      theme,
      spangram: spangram.toUpperCase(),
      spangramPosition,
      difficulty: calculateDifficulty(wordsWithPositions),
      hints,
      source: 'manual-input',
      isReal: true
    }

    return NextResponse.json({
      success: true,
      data: {
        puzzle,
        message: "Manual puzzle data successfully processed"
      }
    })

  } catch (error) {
    console.error("Error processing manual puzzle data:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to process manual puzzle data",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

function generateWordPositions(word: string, grid: string[][], index: number): any[] {
  // 简单的位置生成逻辑
  const positions = []
  for (let i = 0; i < word.length; i++) {
    positions.push({ row: Math.floor(index / 7), col: i })
  }
  return positions
}

function generateSpangramPosition(spangram: string, words: any[]): any {
  const spangramWord = words.find(w => w.word === spangram.toUpperCase())
  if (!spangramWord || spangramWord.positions.length === 0) {
    return { start: {row: 0, col: 0}, end: {row: 0, col: 0}, direction: 'horizontal' }
  }
  
  const positions = spangramWord.positions
  const start = positions[0]
  const end = positions[positions.length - 1]
  
  const direction = start.row === end.row ? 'horizontal' : 'vertical'
  
  return { start, end, direction }
}

function determineWordCategory(word: string): string {
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

function calculateDifficulty(words: any[]): 'easy' | 'medium' | 'hard' {
  const avgLength = words.reduce((sum, word) => sum + word.word.length, 0) / words.length
  if (avgLength <= 4) return 'easy'
  if (avgLength <= 6) return 'medium'
  return 'hard'
}

function generateStrandsHints(theme: string, spangram: string, words: any[]): any[] {
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
      content: `Look for these words: ${words.slice(0, 3).map((w: any) => w.word).join(', ')}`,
      color: "purple",
      example: "These words are all related to today's theme",
      tip: "Words can connect in any direction, including diagonally"
    }
  ]
}
