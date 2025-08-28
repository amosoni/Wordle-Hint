import { NextResponse } from "next/server"
import { ArticleManager } from '@/utils/articleManager'
import { WordleApiService } from '@/utils/wordleApi'
import { NextRequest } from 'next/server'
import { RealWordleHintsService } from '@/utils/realWordleHints'

export async function GET(request: NextRequest) {
  try {
    console.log('Starting enhanced API request...')
    
    // 获取当前日期
    const currentDate = new Date().toISOString().slice(0, 10)
    
    // 使用与real-hints页面相同的单词生成逻辑
    const getGlobalCurrentWord = (dateStr: string): string => {
      const dateSeed = parseInt(dateStr.replace(/-/g, ''), 10)
      const commonWords = [
        'CRANE', 'STARE', 'SHARE', 'SPARE', 'SCARE', 'SNARE', 'SWARE', 'SLATE', 'STATE', 'SKATE',
        'BRAVE', 'DREAM', 'FLAME', 'GRACE', 'HAPPY', 'JOLLY', 'KNIFE', 'LIGHT', 'MAGIC', 'NIGHT',
        'OCEAN', 'PEACE', 'QUICK', 'RADIO', 'SMART', 'TRAIN', 'UNITE', 'VOICE', 'WATER', 'YOUTH'
      ]
      const wordIndex = (dateSeed * 7 + 13) % commonWords.length
      return commonWords[wordIndex]
    }
    
    // 获取当前应该使用的单词
    const currentWord = getGlobalCurrentWord(currentDate)
    console.log(`🌐 Global current word: ${currentWord} for date: ${currentDate}`)
    
    // Check for force refresh parameter
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get('refresh') === 'true'
    
    // Initialize article manager
    const articleManager = ArticleManager.getInstance()
    await articleManager.initialize()
    
    // Get today's word from real Wordle API
    const wordleApi = WordleApiService.getInstance()
    let todayWordResponse: import('@/utils/wordleApi').WordleApiResponse
    
    if (forceRefresh) {
      console.log('Force refresh requested, clearing cache...')
      todayWordResponse = await wordleApi.forceRefreshTodayWord()
    } else {
      todayWordResponse = await wordleApi.getTodayWord()
    }
    
    if (!todayWordResponse.success || !todayWordResponse.data) {
      throw new Error('Failed to fetch today\'s Wordle word')
    }
    
    const todayWord = todayWordResponse.data.word
    const wordNumber = todayWordResponse.data.wordNumber
    const isReal = todayWordResponse.data.isReal
    const source = todayWordResponse.data.source
    
    console.log(`Today's Wordle word: ${todayWord} (${wordNumber}) from ${source}`)
    
    // Get today's articles; if none, force-generate now to ensure availability
    let todayArticles = await articleManager.getTodayArticles()
    if (!todayArticles || todayArticles.length === 0) {
      console.log('No articles found for today in storage. Force-generating now...')
      const gen = await articleManager.generateArticlesForWord(
        todayWord,
        todayWordResponse.data,
        true
      )
      if (gen.success && gen.articles) {
        todayArticles = gen.articles
      }
    }
    
    // Get real Wordle hints from the service
    const realHintsService = RealWordleHintsService.getInstance()
    const realHintsData = await realHintsService.getTodayHints()
    
    // Use real hints if available, otherwise fallback to generated hints
    const hints = realHintsData.officialHintsAvailable ? 
      realHintsData.hints : 
      generateDynamicHints(todayWord)
    
    // Generate dynamic educational content based on the real word
    const educationalContent = generateEducationalContent(todayWord)
    
    // Return enhanced response with real articles
    console.log('Returning enhanced data successfully')
    
    return NextResponse.json({
      success: true,
      data: {
        word: todayWord,
        hints: hints,
        source: source,
        isReal: isReal,
        date: new Date().toISOString().split('T')[0],
        wordNumber: wordNumber,
        apiStatus: 'Enhanced API with real Wordle data and article generation',
        // Enhanced educational content
        educationalContent: educationalContent,
        learningTips: generateLearningTips(todayWord),
        relatedWords: generateRelatedWords(todayWord),
        // Real generated articles
        articles: todayArticles && todayArticles.length > 0 ? todayArticles : [],
        // Article generation status
        articleGenerationStatus: {
          isGenerating: articleManager.isGeneratingArticles(),
          totalArticles: todayArticles ? todayArticles.length : 0,
          lastUpdated: new Date().toISOString()
        }
      },
    })
  } catch (error) {
    console.error('Error in enhanced API route:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Enhanced API route error',
      data: {
        word: "ERROR",
        hints: [],
        source: 'Error',
        isReal: false,
        date: new Date().toISOString().split('T')[0],
        wordNumber: 0,
        apiStatus: 'Error occurred',
        educationalContent: {},
        learningTips: [],
        relatedWords: {},
        articles: [],
        articleGenerationStatus: {
          isGenerating: false,
          totalArticles: 0,
          lastUpdated: new Date().toISOString()
        }
      },
      error: error instanceof Error ? error.message : String(error),
    }, { status: 200 })
  }
}

/**
 * Generate dynamic hints based on the actual Wordle word
 */
function generateDynamicHints(word: string): Array<{
  level: number
  title: string
  description: string
  badge: string
  color: string
  example: string
  tip: string
}> {
  const vowels = 'AEIOU'
  
  // Count vowels and consonants
  const vowelCount = word.split('').filter(letter => vowels.includes(letter)).length
  const consonantCount = word.length - vowelCount
  
  // Get letter frequency
  const letterFreq: Record<string, number> = {}
  word.split('').forEach(letter => {
    letterFreq[letter] = (letterFreq[letter] || 0) + 1
  })
  
  // Find most common letter
  const mostCommonLetter = Object.entries(letterFreq)
    .sort(([,a], [,b]) => b - a)[0]
  
  // Check for common patterns
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
      example: `This word contains ${vowelCount} vowels and ${consonantCount} consonants`,
      tip: "Focus on the vowel-consonant pattern to narrow down possibilities"
    },
    {
      level: 2,
      title: "Letter Frequency", 
      description: "Information about how often certain letters appear in this word",
      badge: "Level 2",
      color: "cyan",
      example: `Most common letter: '${mostCommonLetter[0]}' appears ${mostCommonLetter[1]} time${mostCommonLetter[1] > 1 ? 's' : ''}`,
      tip: "Common letters like E, A, R, T appear frequently in English words"
    },
    {
      level: 3,
      title: "Strategic Guide",
      description: "More specific guidance that helps you form a strategy",
      badge: "Level 3",
      color: "purple",
      example: `Starts with '${word[0]}', ends with '${word[word.length - 1]}', and contains letter '${word[Math.floor(word.length / 2)]}' in the middle`,
      tip: "Use the first and last letters as anchors, then work on the middle"
    },
    {
      level: 4,
      title: "Pattern Recognition",
      description: "Common letter combinations and patterns in this word",
      badge: "Level 4",
      color: "orange",
      example: patterns.length > 0 
        ? `Contains patterns: ${patterns.join(', ')}`
        : "No common patterns detected",
      tip: "Look for common letter combinations like 'TH', 'CH', 'SH', 'ING'"
    },
    {
      level: 5,
      title: "Word Characteristics",
      description: "Specific details about the word's structure and meaning",
      badge: "Level 5",
      color: "red",
      example: `This is a ${word.length}-letter word with ${vowelCount} vowels and ${consonantCount} consonants`,
      tip: "Try starting with common letters and work your way through systematically"
    },
    {
      level: 6,
      title: "Direct Clue",
      description: "Clear direction when you're really stuck - use sparingly",
      badge: "Level 6",
      color: "green",
      example: `Letter positions: ${word.split('').map((letter, index) => `${letter}(${index + 1})`).join(', ')}`,
      tip: "This is the final hint - use it only when completely stuck!"
    }
  ]
}

/**
 * Generate educational content based on the actual word
 */
function generateEducationalContent(word: string): {
  wordOrigin: string
  funFact: string
  usageExamples: string[]
  pronunciation: string
  dailyQuestions: string[]
  wordAnalysis: {
    length: number
    vowelCount: number
    consonantCount: number
    uniqueLetters: number
  }
  learningChallenges: Array<{
    difficulty: string
    type: string
    challenge: string
    examples: string[]
  }>
  relatedTopics: string[]
} {
  const vowels = 'AEIOU'
  const vowelCount = word.split('').filter(letter => vowels.includes(letter)).length
  
  return {
    wordOrigin: `The word "${word}" has interesting origins in English`,
    funFact: `"${word}" is a ${word.length}-letter word that appears frequently in everyday language`,
    usageExamples: [
      `I ${word.toLowerCase()} to see you today.`,
      `This is a great example of how to use "${word}".`,
      `The word "${word}" can be used in many contexts.`
    ],
    pronunciation: `Pronunciation: ${word.split('').join('-')}`,
    dailyQuestions: [
      `How many times have you used the word "${word}" today?`,
      `Can you think of 3 synonyms for "${word}"?`
    ],
    wordAnalysis: {
      length: word.length,
      vowelCount: vowelCount,
      consonantCount: word.length - vowelCount,
      uniqueLetters: new Set(word.split('')).size
    },
      learningChallenges: [
    {
      difficulty: 'easy',
      type: 'vocabulary',
      challenge: `Try to use "${word}" in a sentence`,
      examples: [
        `I ${word.toLowerCase()} to help you.`,
        `This word ${word.toLowerCase()}s many meanings.`,
        `Let's ${word.toLowerCase()} this together.`
      ]
    },
    {
      difficulty: 'medium',
      type: 'word_play',
      challenge: `Find words that rhyme with "${word}"`,
      examples: [
        `Words ending with similar sounds`,
        `Look for patterns in pronunciation`,
        `Think of words with similar endings`
      ]
    },
    {
      difficulty: 'hard',
      type: 'analysis',
      challenge: `Analyze the structure of "${word}"`,
      examples: [
        `Count vowels and consonants`,
        `Identify letter patterns`,
        `Find similar word structures`
      ]
    }
  ],
    relatedTopics: ["Vocabulary", "Word Games", "Language Learning"]
  }
}

/**
 * Generate learning tips based on the actual word
 */
function generateLearningTips(word: string): string[] {
  return [
    `Focus on the letter "${word[0]}" as your starting point`,
    `Remember that "${word}" has ${word.length} letters`,
    `Try common letter combinations when guessing`,
    `Use the vowel-consonant pattern to your advantage`,
    `Practice with similar word structures`
  ]
}

/**
 * Generate related words based on the actual word
 */
function generateRelatedWords(word: string): {
  synonyms: string[]
  antonyms: string[]
  similar: string[]
} {
  // This could be expanded with a real dictionary API
  return {
    synonyms: [`similar to ${word}`, `alike ${word}`, `comparable to ${word}`],
    antonyms: [`different from ${word}`, `unlike ${word}`, `dissimilar to ${word}`],
    similar: [`words`, `with`, `similar`, `patterns`, `to ${word}`]
  }
}





