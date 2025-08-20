import { NextResponse } from "next/server"
import { ArticleManager } from '@/utils/articleManager'

export async function GET() {
  try {
    console.log('Starting enhanced API request...')
    
    // Initialize article manager
    const articleManager = ArticleManager.getInstance()
    await articleManager.initialize()
    
    // Get today's word and articles
    const todayArticles = await articleManager.getTodayArticles()
    
    // Get basic data
    const basicData = {
      word: "ABOUT", // This will be replaced by real API data
      source: 'Enhanced API',
      isReal: true,
      date: new Date().toISOString().split('T')[0]
    }
    
    // Get hints (keeping existing logic for now)
    const hints = [
      {
        level: 1,
        title: "Gentle Nudge",
        description: "A subtle hint that gives you a general direction without spoiling the puzzle",
        badge: "Level 1",
        color: "blue",
        example: "This word contains 2 vowels and 3 consonants",
        tip: "Focus on the vowel-consonant pattern to narrow down possibilities"
      },
      {
        level: 2,
        title: "Letter Frequency", 
        description: "Information about how often certain letters appear in this word",
        badge: "Level 2",
        color: "cyan",
        example: "Most common letter: 'A' appears 1 time",
        tip: "Common letters like E, A, R, T appear frequently in English words"
      },
      {
        level: 3,
        title: "Strategic Guide",
        description: "More specific guidance that helps you form a strategy",
        badge: "Level 3",
        color: "purple",
        example: "Starts with 'A', ends with 'T', and contains letter 'O' in the middle",
        tip: "Use the first and last letters as anchors, then work on the middle"
      },
      {
        level: 4,
        title: "Pattern Recognition",
        description: "Common letter combinations and patterns in this word",
        badge: "Level 4",
        color: "orange",
        example: "Contains pattern: No common patterns detected",
        tip: "Look for common letter combinations like 'TH', 'CH', 'SH', 'ING'"
      },
      {
        level: 5,
        title: "Word Characteristics",
        description: "Specific details about the word's structure and meaning",
        badge: "Level 5",
        color: "red",
        example: "This is a 5-letter word with a balanced vowel-consonant structure",
        tip: "Try starting with common letters and work on your way through systematically"
      },
      {
        level: 6,
        title: "Direct Clue",
        description: "Clear direction when you're really stuck - use sparingly",
        badge: "Level 6",
        color: "green",
        example: "Letter positions: A(1), B(2), O(3), U(4), T(5)",
        tip: "This is the final hint - use it only when completely stuck!"
      }
    ]
    
    // Basic educational content
    const basicEducationalContent = {
      wordOrigin: "Enhanced word origin information",
      funFact: "Interesting fact about this word",
      usageExamples: ["Example sentence 1", "Example sentence 2"],
      pronunciation: "Enhanced pronunciation guide",
      dailyQuestions: [],
      wordAnalysis: {},
      learningChallenges: [],
      relatedTopics: []
    }
    
    // Return enhanced response with real articles
    console.log('Returning enhanced data successfully')
    
    return NextResponse.json({
      success: true,
      data: {
        word: basicData.word,
        hints: hints,
        source: basicData.source,
        isReal: basicData.isReal,
        date: basicData.date,
        wordNumber: 1,
        apiStatus: 'Enhanced API with article generation',
        // Enhanced educational content
        educationalContent: basicEducationalContent,
        learningTips: ["Enhanced learning tip"],
        relatedWords: { synonyms: [], antonyms: [], similar: [] },
        // Real generated articles
        articles: todayArticles.length > 0 ? todayArticles : [],
        // Article generation status
        articleGenerationStatus: {
          isGenerating: articleManager.isGeneratingArticles(),
          totalArticles: todayArticles.length,
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





