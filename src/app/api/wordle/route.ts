import { NextResponse } from "next/server"

// Primary API: Wordle API (Vercel)
const VERCEL_WORDLE_API = 'https://wordle-api.vercel.app/api/today'

// Get today's word from Vercel API
async function getTodayWordFromAPI() {
  try {
    console.log('Fetching from Vercel Wordle API...')
    
    const response = await fetch(VERCEL_WORDLE_API, {
      headers: {
        'User-Agent': 'WordleHint.help/1.0',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(5000)
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Vercel API response:', data)
      
      if (data.word && typeof data.word === 'string' && data.word.length === 5) {
        return {
          word: data.word.toUpperCase(),
          source: 'Vercel Wordle API (Real-time)',
          isReal: true,
          date: data.date || new Date().toISOString().split('T')[0]
        }
      }
    }
    
    throw new Error('Invalid response from Vercel API')
    
  } catch (error) {
    console.log('Vercel API failed, using fallback:', error)
    
    // Fallback to local word list
    const fallbackWord = getTodayWordFallback()
    return {
      word: fallbackWord,
      source: 'Local Fallback (API Failed)',
      isReal: false,
      date: new Date().toISOString().split('T')[0]
    }
  }
}

// Fallback function using local word list
function getTodayWordFallback() {
  const today = new Date()
  const startDate = new Date('2021-06-19')
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const WORDLE_WORDS = ['ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN']
  return WORDLE_WORDS[daysSinceStart % WORDLE_WORDS.length]
}

// Generate hints for a word
function generateHints(word: string) {
  const vowels = ['A', 'E', 'I', 'O', 'U']
  const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z']
  
  const wordLetters = word.split('')
  const wordVowels = wordLetters.filter((letter: string) => vowels.includes(letter))
  const wordConsonants = wordLetters.filter((letter: string) => consonants.includes(letter))
  
  return [
    {
      level: 1,
      title: "Gentle Nudge",
      description: "A subtle hint that gives you a general direction without spoiling the puzzle",
      badge: "Level 1",
      color: "blue",
      example: `This word contains ${wordVowels.length} vowel${wordVowels.length !== 1 ? 's' : ''} and ${wordConsonants.length} consonant${wordConsonants.length !== 1 ? 's' : ''}`
    },
    {
      level: 2,
      title: "Strategic Guide", 
      description: "More specific guidance that helps you form a strategy",
      badge: "Level 2",
      color: "purple",
      example: `Starts with '${wordLetters[0]}', ends with '${wordLetters[4]}', and contains letter '${wordLetters[2]}' in the middle`
    },
    {
      level: 3,
      title: "Direct Clue",
      description: "Clear direction when you're really stuck - use sparingly",
      badge: "Level 3",
      color: "green",
              example: `Letter positions: ${wordLetters.map((letter: string, index: number) => `${letter}(${index + 1})`).join(', ')}`
    }
  ]
}

export async function GET() {
  try {
    const wordData = await getTodayWordFromAPI()
    const hints = generateHints(wordData.word)
    
    return NextResponse.json({
      success: true,
      data: {
        word: wordData.word,
        hints: hints,
        source: wordData.source,
        isReal: wordData.isReal,
        date: wordData.date,
        wordNumber: Math.floor((new Date().getTime() - new Date('2021-06-19').getTime()) / (1000 * 60 * 60 * 24)),
        apiStatus: wordData.isReal ? 'Real-time from Vercel API' : 'Fallback to local word list'
      },
    })
  } catch (error) {
    console.error('Error in Wordle API route:', error)
    
    const fallbackWord = getTodayWordFallback()
    const hints = generateHints(fallbackWord)
    
    return NextResponse.json({
      success: false,
      message: 'API route error, using fallback',
      data: {
        word: fallbackWord,
        hints: hints,
        source: 'Local Fallback (Route Error)',
        isReal: false,
        date: new Date().toISOString().split('T')[0],
        wordNumber: Math.floor((new Date().getTime() - new Date('2021-06-19').getTime()) / (1000 * 60 * 60 * 24)),
        apiStatus: 'Error occurred, using local fallback'
      },
      error: error instanceof Error ? error.message : String(error),
    }, { status: 200 })
  }
}