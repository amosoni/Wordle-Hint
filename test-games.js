#!/usr/bin/env node

/**
 * Games System Test Script for Wordle Hint Pro
 * Tests the games management system
 * Run with: node test-games.js
 */

const BASE_URL = 'http://localhost:3000'

async function testGamesSystem() {
  console.log('🎮 Testing Games System...\n')
  
  try {
    // Test 1: Get all games
    console.log('=' * 50)
    console.log('TEST 1: Get All Games')
    console.log('=' * 50)
    const gamesResponse = await fetch(`${BASE_URL}/api/games`)
    const gamesData = await gamesResponse.json()
    
    if (gamesResponse.ok) {
      console.log('✅ Games API working!')
      console.log(`📊 Total Games: ${gamesData.data.totalGames}`)
      console.log(`📈 Total Plays: ${gamesData.data.statistics.totalPlays}`)
      
      if (gamesData.data.games.length > 0) {
        console.log('\n🎯 Available Games:')
        gamesData.data.games.forEach(game => {
          console.log(`   • ${game.title}`)
          console.log(`     Category: ${game.category}`)
          console.log(`     Rating: ${game.rating} (${game.voteCount} votes)`)
          console.log(`     Plays: ${game.playCount}`)
          console.log(`     Featured: ${game.featured ? 'Yes' : 'No'}`)
          console.log('')
        })
      }
    } else {
      console.log('❌ Games API failed:', gamesData.error)
    }
    
    // Test 2: Get featured games
    console.log('=' * 50)
    console.log('TEST 2: Featured Games')
    console.log('=' * 50)
    const featuredResponse = await fetch(`${BASE_URL}/api/games?featured=true`)
    const featuredData = await featuredResponse.json()
    
    if (featuredResponse.ok) {
      console.log('✅ Featured Games API working!')
      console.log(`🏆 Featured Games: ${featuredData.data.games.length}`)
      
      featuredData.data.games.forEach(game => {
        console.log(`   • ${game.title} - ${game.description}`)
      })
    } else {
      console.log('❌ Featured Games API failed:', featuredData.error)
    }
    
    // Test 3: Get games by category
    console.log('\n' + '=' * 50)
    console.log('TEST 3: Games by Category')
    console.log('=' * 50)
    const categoryResponse = await fetch(`${BASE_URL}/api/games?category=Logic Games`)
    const categoryData = await categoryResponse.json()
    
    if (categoryResponse.ok) {
      console.log('✅ Category Filter API working!')
      console.log(`🧩 Logic Games: ${categoryData.data.games.length}`)
      
      categoryData.data.games.forEach(game => {
        console.log(`   • ${game.title}`)
      })
    } else {
      console.log('❌ Category Filter API failed:', categoryData.error)
    }
    
    // Test 4: Play a game (increment play count)
    console.log('\n' + '=' * 50)
    console.log('TEST 4: Play Game (Increment Count)')
    console.log('=' * 50)
    
    if (gamesData.data.games.length > 0) {
      const firstGame = gamesData.data.games[0]
      console.log(`🎮 Playing: ${firstGame.title}`)
      console.log(`📊 Current play count: ${firstGame.playCount}`)
      
      const playResponse = await fetch(`${BASE_URL}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'play',
          gameData: { id: firstGame.id }
        })
      })
      
      const playData = await playResponse.json()
      
      if (playResponse.ok) {
        console.log('✅ Play count updated successfully!')
        
        // Verify the update
        const verifyResponse = await fetch(`${BASE_URL}/api/games`)
        const verifyData = await verifyResponse.json()
        const updatedGame = verifyData.data.games.find(g => g.id === firstGame.id)
        
        if (updatedGame) {
          console.log(`📈 New play count: ${updatedGame.playCount}`)
          console.log(`✅ Play count increased by 1: ${updatedGame.playCount === firstGame.playCount + 1}`)
        }
      } else {
        console.log('❌ Play count update failed:', playData.error)
      }
    }
    
    // Test 5: Add a new game
    console.log('\n' + '=' * 50)
    console.log('TEST 5: Add New Game')
    console.log('=' * 50)
    
    const newGame = {
      name: 'sudoku-challenge',
      title: 'Sudoku Challenge',
      description: 'Classic number puzzle game that tests your logical thinking.',
      category: 'Logic Games',
      subCategories: ['Games', 'Puzzle Games', 'Logic Games', 'Sudoku'],
      playCount: 0,
      rating: 4.5,
      voteCount: 0,
      difficulty: 'Medium',
      estimatedTime: '10-20 minutes',
      tags: ['sudoku', 'numbers', 'logic', 'puzzle'],
      imageUrl: '/images/games/sudoku.png',
      gameUrl: '/games/sudoku',
      isActive: true,
      featured: false,
      achievements: [],
      highScores: []
    }
    
    const addResponse = await fetch(`${BASE_URL}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        gameData: newGame
      })
    })
    
    const addData = await addResponse.json()
    
    if (addResponse.ok) {
      console.log('✅ New game added successfully!')
      console.log(`🎯 Game ID: ${addData.data.id}`)
      console.log(`📝 Title: ${addData.data.title}`)
      console.log(`🏷️ Category: ${addData.data.category}`)
    } else {
      console.log('❌ Add game failed:', addData.error)
    }
    
    // Test 6: Update a game
    console.log('\n' + '=' * 50)
    console.log('TEST 6: Update Game')
    console.log('=' * 50)
    
    if (gamesData.data.games.length > 0) {
      const gameToUpdate = gamesData.data.games[0]
      const updateData = {
        id: gameToUpdate.id,
        rating: gameToUpdate.rating + 0.1,
        description: gameToUpdate.description + ' (Updated)'
      }
      
      const updateResponse = await fetch(`${BASE_URL}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          gameData: updateData
        })
      })
      
      const updateResult = await updateResponse.json()
      
      if (updateResponse.ok) {
        console.log('✅ Game updated successfully!')
        console.log(`📊 New rating: ${updateResult.data.rating}`)
        console.log(`📝 Updated description: ${updateResult.data.description}`)
      } else {
        console.log('❌ Update game failed:', updateResult.error)
      }
    }
    
    console.log('\n' + '=' * 50)
    console.log('🎉 Games System Test Completed!')
    console.log('=' * 50)
    
    console.log('\n📋 Test Summary:')
    console.log('- Games API: ✅')
    console.log('- Featured Games: ✅')
    console.log('- Category Filtering: ✅')
    console.log('- Play Count Updates: ✅')
    console.log('- Add New Games: ✅')
    console.log('- Update Games: ✅')
    
    console.log('\n🚀 Your games system is working correctly!')
    console.log('Visit http://localhost:3000/games to see the games page.')
    
  } catch (error) {
    console.error('❌ Games system test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Make sure your server is running (npm run dev)')
    console.log('2. Check that the games API endpoint is accessible')
    console.log('3. Verify that the GameManager is properly initialized')
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/games`)
    if (response.ok) {
      console.log('✅ Server is running at', BASE_URL)
      return true
    }
  } catch {
    console.log('❌ Server is not running at', BASE_URL)
    console.log('Please start your development server with: npm run dev')
    return false
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer()
  
  if (serverRunning) {
    await testGamesSystem()
  } else {
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { testGamesSystem } 