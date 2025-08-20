#!/usr/bin/env node

/**
 * Article Restoration Script for Wordle Hint Pro
 * This script will restore previously generated articles
 * Run with: node restore-articles.js
 */

const BASE_URL = 'http://localhost:3000'

async function restoreArticles() {
  console.log('🔄 Starting article restoration process...\n')
  
  try {
    // Step 1: Check current system status
    console.log('📊 Checking current system status...')
    const statusResponse = await fetch(`${BASE_URL}/api/admin`)
    const statusData = await statusResponse.json()
    
    if (statusData.success) {
      console.log(`✅ System Status:`)
      console.log(`   - Total Articles: ${statusData.data.articles.totalArticles}`)
      console.log(`   - Today's Word: ${statusData.data.articles.todayWord || 'Not set'}`)
      console.log(`   - Scheduler: ${statusData.data.scheduler.isRunning ? 'Running' : 'Stopped'}`)
    }
    
    // Step 2: Restore TEST articles (from the test output)
    console.log('\n🔄 Restoring TEST articles...')
    const restoreResponse = await fetch(`${BASE_URL}/api/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'restore_test_articles' })
    })
    
    const restoreData = await restoreResponse.json()
    if (restoreData.success) {
      console.log(`✅ TEST articles restored successfully!`)
      console.log(`   - Articles generated: ${restoreData.articles.length}`)
    } else {
      console.log(`❌ Failed to restore TEST articles: ${restoreData.error}`)
    }
    
    // Step 3: Regenerate articles for common words
    console.log('\n🔄 Regenerating articles for common words...')
    const regenerateResponse = await fetch(`${BASE_URL}/api/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'regenerate_all_articles' })
    })
    
    const regenerateData = await regenerateResponse.json()
    if (regenerateData.success) {
      console.log(`✅ Common words articles regenerated!`)
      console.log(`   - Results:`)
      regenerateData.results.forEach(result => {
        const status = result.success ? '✅' : '❌'
        console.log(`     ${status} ${result.word}: ${result.success ? `${result.articlesCount} articles` : result.error}`)
      })
    } else {
      console.log(`❌ Failed to regenerate common words: ${regenerateData.error}`)
    }
    
    // Step 4: Check final status
    console.log('\n📊 Checking final system status...')
    const finalStatusResponse = await fetch(`${BASE_URL}/api/admin`)
    const finalStatusData = await finalStatusResponse.json()
    
    if (finalStatusData.success) {
      console.log(`✅ Final System Status:`)
      console.log(`   - Total Articles: ${finalStatusData.data.articles.totalArticles}`)
      console.log(`   - Today's Word: ${finalStatusData.data.articles.todayWord || 'Not set'}`)
      console.log(`   - Scheduler: ${finalStatusData.data.scheduler.isRunning ? 'Running' : 'Stopped'}`)
    }
    
    // Step 5: Test articles API
    console.log('\n🔍 Testing articles API...')
    const articlesResponse = await fetch(`${BASE_URL}/api/articles?type=recent&limit=10`)
    const articlesData = await articlesResponse.json()
    
    if (articlesData.success) {
      console.log(`✅ Articles API working!`)
      console.log(`   - Total articles available: ${articlesData.data.total}`)
      console.log(`   - Recent articles: ${articlesData.data.articles.length}`)
      
      if (articlesData.data.articles.length > 0) {
        console.log(`   - Sample articles:`)
        articlesData.data.articles.slice(0, 3).forEach(article => {
          console.log(`     • ${article.title} (${article.category})`)
        })
      }
    } else {
      console.log(`❌ Articles API failed: ${articlesData.error}`)
    }
    
    console.log('\n🎉 Article restoration process completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Visit http://localhost:3000/blog to see the restored articles')
    console.log('2. Check http://localhost:3000/api/admin for system status')
    console.log('3. Use the test script to verify everything is working')
    
  } catch (error) {
    console.error('❌ Restoration process failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Make sure your server is running (npm run dev)')
    console.log('2. Check that all API endpoints are accessible')
    console.log('3. Verify the storage directory has write permissions')
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin`)
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
    await restoreArticles()
  } else {
    process.exit(1)
  }
}

// Run restoration if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { restoreArticles } 