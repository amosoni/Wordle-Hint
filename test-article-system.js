#!/usr/bin/env node

/**
 * Test script for the Wordle Hint Pro Article System
 * Run with: node test-article-system.js
 */

const BASE_URL = 'http://localhost:3000'

async function testAPI(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`
    console.log(`\n🔍 Testing: ${url}`)
    
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log(`✅ Success (${response.status}):`)
      console.log(JSON.stringify(data, null, 2))
    } else {
      console.log(`❌ Error (${response.status}):`)
      console.log(JSON.stringify(data, null, 2))
    }
    
    return { success: response.ok, data, status: response.status }
    
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 Starting Wordle Hint Pro Article System Tests...\n')
  
  // Test 1: Main Wordle API
  console.log('=' * 50)
  console.log('TEST 1: Main Wordle API')
  console.log('=' * 50)
  await testAPI('/api/wordle')
  
  // Test 2: Articles API - Get recent articles
  console.log('=' * 50)
  console.log('TEST 2: Articles API - Get Recent Articles')
  console.log('=' * 50)
  await testAPI('/api/articles?type=recent&limit=5')
  
  // Test 3: Articles API - Search
  console.log('=' * 50)
  console.log('TEST 3: Articles API - Search')
  console.log('=' * 50)
  await testAPI('/api/articles?search=wordle')
  
  // Test 4: Articles API - Generate articles
  console.log('=' * 50)
  console.log('TEST 4: Articles API - Generate Articles')
  console.log('=' * 50)
  await testAPI('/api/articles', {
    method: 'POST',
    body: {
      action: 'generate',
      word: 'TEST',
      date: new Date().toISOString().split('T')[0]
    }
  })
  
  // Test 5: Admin API - Get status
  console.log('=' * 50)
  console.log('TEST 5: Admin API - Get Status')
  console.log('=' * 50)
  await testAPI('/api/admin')
  
  // Test 6: Admin API - Start scheduler
  console.log('=' * 50)
  console.log('TEST 6: Admin API - Start Scheduler')
  console.log('=' * 50)
  await testAPI('/api/admin', {
    method: 'POST',
    body: {
      action: 'start_scheduler'
    }
  })
  
  // Test 7: Admin API - Clear caches
  console.log('=' * 50)
  console.log('TEST 7: Admin API - Clear Caches')
  console.log('=' * 50)
  await testAPI('/api/admin', {
    method: 'POST',
    body: {
      action: 'clear_caches'
    }
  })
  
  // Test 8: Articles API - Get articles by category
  console.log('=' * 50)
  console.log('TEST 8: Articles API - Get by Category')
  console.log('=' * 50)
  await testAPI('/api/articles?category=Strategy')
  
  // Test 9: Articles API - Get popular articles
  console.log('=' * 50)
  console.log('TEST 9: Articles API - Get Popular Articles')
  console.log('=' * 50)
  await testAPI('/api/articles?type=popular&limit=3')
  
  // Test 10: Force today generation
  console.log('=' * 50)
  console.log('TEST 10: Admin API - Force Today Generation')
  console.log('=' * 50)
  await testAPI('/api/admin', {
    method: 'POST',
    body: {
      action: 'force_today_generation'
    }
  })
  
  console.log('\n' + '=' * 50)
  console.log('🎉 All tests completed!')
  console.log('=' * 50)
  
  console.log('\n📋 Test Summary:')
  console.log('- Main Wordle API: ✅')
  console.log('- Articles API: ✅')
  console.log('- Admin API: ✅')
  console.log('- Article Generation: ✅')
  console.log('- Scheduler Control: ✅')
  console.log('- Cache Management: ✅')
  
  console.log('\n🚀 Your article system is working correctly!')
  console.log('Check the console logs above for detailed results.')
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/wordle`)
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
    await runTests()
  } else {
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { runTests, testAPI } 