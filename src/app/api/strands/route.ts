import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { StrandsApiService } from "@/utils/strandsApi"

export async function GET(request: NextRequest) {
  try {
    // Get Strands API service
    const strandsApi = StrandsApiService.getInstance()
    
    // Get date from query parameter, default to today
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split("T")[0]
    
    // Get puzzle for specified date
    const puzzleResponse = await strandsApi.getPuzzleForDate(date)
    
    if (!puzzleResponse.success || !puzzleResponse.data) {
      throw new Error("Failed to fetch today's Strands puzzle")
    }
    
    const puzzle = puzzleResponse.data
    
    // Return response
    return NextResponse.json({
      success: true,
      data: {
        puzzle: puzzle,
        date: date,
        apiStatus: "Strands API",
        gameType: "strands"
      },
    })
  } catch (error) {
    console.error("Error in Strands API route:", error)

    return NextResponse.json({
      success: false,
      error: "Failed to fetch Strands data",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
        const { action, puzzleId, foundWords, hintsUsed } = body
    
    switch (action) {
      case "getHint":
        if (!puzzleId) {
          return NextResponse.json({
            success: false,
            error: "Puzzle ID is required"
          }, { status: 400 })
        }
        
        // Get puzzle and generate smart hint
        const strandsApi = StrandsApiService.getInstance()
        const puzzleResponse = await strandsApi.getTodayPuzzle()
        
        if (!puzzleResponse.success || !puzzleResponse.data) {
          return NextResponse.json({
            success: false,
            error: "Puzzle not found"
          }, { status: 404 })
        }
        
        const puzzleData = puzzleResponse.data
        const currentFoundWords = foundWords || []
        const currentHintsUsed = hintsUsed || 0
        
        // Generate smart hint based on current game state
        const smartHint = strandsApi.generateSmartHint(puzzleData, currentFoundWords, currentHintsUsed)
        
        if (!smartHint) {
          return NextResponse.json({
            success: false,
            error: "No more hints available"
          }, { status: 404 })
        }
        
        return NextResponse.json({
          success: true,
          data: {
            hint: smartHint,
            remainingWords: puzzleData.words.filter(w => !currentFoundWords.includes(w.word.toUpperCase())).length,
            totalWords: puzzleData.words.length,
            foundWords: currentFoundWords.length
          }
        })

      case "checkWord":
        if (!puzzleId || !foundWords) {
          return NextResponse.json({
            success: false,
            error: "Puzzle ID and found words are required"
          }, { status: 400 })
        }
        
        // Get puzzle and check if all words are found
        const strandsApiCheck = StrandsApiService.getInstance()
        const puzzleResponseCheck = await strandsApiCheck.getTodayPuzzle()
        
        if (!puzzleResponseCheck.success || !puzzleResponseCheck.data) {
          return NextResponse.json({
            success: false,
            error: "Puzzle not found"
          }, { status: 404 })
        }
        
        const puzzleCheck = puzzleResponseCheck.data
        const allWordsFound = puzzleCheck.words.every(word => 
          foundWords.includes(word.word)
        )
        
        return NextResponse.json({
          success: true,
          data: {
            allWordsFound,
            totalWords: puzzleCheck.words.length,
            foundWords: foundWords.length,
            spangramFound: foundWords.includes(puzzleCheck.spangram),
            gameComplete: allWordsFound
          }
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: "Invalid action. Supported actions: getHint, checkWord"
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error("Error in Strands POST:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to process Strands request",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
