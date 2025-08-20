import { NextRequest, NextResponse } from "next/server"
import { GameManager } from '@/utils/gameManager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gameManager = GameManager.getInstance()
    
    // Get query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Build search parameters
    const searchParams_obj: Record<string, unknown> = {}
    if (category) searchParams_obj.category = category
    if (search) searchParams_obj.search = search
    if (featured) searchParams_obj.featured = featured === 'true'
    
    // Get games based on search parameters
    let games
    if (Object.keys(searchParams_obj).length > 0) {
      games = gameManager.searchGames(searchParams_obj)
    } else {
      games = gameManager.getAllGames()
    }
    
    // Apply limit
    if (limit > 0) {
      games = games.slice(0, limit)
    }
    
    // Get game statistics
    const stats = gameManager.getGameStats()
    
    return NextResponse.json({
      success: true,
      data: {
        games,
        totalGames: games.length,
        statistics: stats
      }
    })
    
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch games',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, gameData } = body
    
    const gameManager = GameManager.getInstance()
    
    switch (action) {
      case 'add':
        if (!gameData) {
          return NextResponse.json({
            success: false,
            error: 'Game data is required'
          }, { status: 400 })
        }
        
        const newGame = gameManager.addGame(gameData)
        return NextResponse.json({
          success: true,
          message: 'Game added successfully',
          data: newGame
        })
        
      case 'update':
        if (!gameData?.id) {
          return NextResponse.json({
            success: false,
            error: 'Game ID is required for update'
          }, { status: 400 })
        }
        
        const updatedGame = gameManager.updateGame(gameData.id, gameData)
        if (!updatedGame) {
          return NextResponse.json({
            success: false,
            error: 'Game not found'
          }, { status: 404 })
        }
        
        return NextResponse.json({
          success: true,
          message: 'Game updated successfully',
          data: updatedGame
        })
        
      case 'play':
        if (!gameData?.id) {
          return NextResponse.json({
            success: false,
            error: 'Game ID is required'
          }, { status: 400 })
        }
        
        const playSuccess = gameManager.incrementPlayCount(gameData.id)
        if (!playSuccess) {
          return NextResponse.json({
            success: false,
            error: 'Game not found'
          }, { status: 404 })
        }
        
        return NextResponse.json({
          success: true,
          message: 'Play count updated successfully'
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: add, update, play'
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Error in games POST:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process game request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 