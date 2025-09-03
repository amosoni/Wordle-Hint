import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { ConnectionsApiService } from "@/utils/connectionsApi"

export async function GET() {
  try {
    // Get Connections API service
    const connectionsApi = ConnectionsApiService.getInstance()
    
    // Get todays puzzle
    const puzzleResponse = await connectionsApi.getTodayPuzzle()
    
    if (!puzzleResponse.success || !puzzleResponse.data) {
      throw new Error("Failed to fetch todays Connections puzzle")
    }
    
    const puzzle = puzzleResponse.data
    
    // Generate educational content
    const educationalContent = await connectionsApi.generateEducationalContent(puzzle)
    
    // Return enhanced response
    return NextResponse.json({
      success: true,
      data: {
        puzzle: puzzle,
        educationalContent: educationalContent,
        date: new Date().toISOString().split("T")[0],
        apiStatus: "Connections API with educational content",
        gameType: "connections"
      },
    })
  } catch (error) {
    console.error("Error in Connections API route:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch Connections data",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, puzzleId, hintLevel } = body
    
    switch (action) {
      case "getHint":
        if (!puzzleId || !hintLevel) {
          return NextResponse.json({
            success: false,
            error: "Puzzle ID and hint level are required"
          }, { status: 400 })
        }
        
        // Get puzzle and return specific hint
        const connectionsApi = ConnectionsApiService.getInstance()
        const puzzleResponse = await connectionsApi.getTodayPuzzle()
        
        if (!puzzleResponse.success || !puzzleResponse.data) {
          return NextResponse.json({
            success: false,
            error: "Puzzle not found"
          }, { status: 404 })
        }
        
        const hint = puzzleResponse.data.hints.find(h => h.level === hintLevel)
        if (!hint) {
          return NextResponse.json({
            success: false,
            error: "Hint not found"
          }, { status: 404 })
        }
        
        return NextResponse.json({
          success: true,
          data: {
            hint: hint,
            remainingHints: puzzleResponse.data.hints.length - hintLevel
          }
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: "Invalid action. Supported actions: getHint"
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error("Error in Connections POST:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to process Connections request",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
