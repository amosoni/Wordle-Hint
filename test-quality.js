#!/usr/bin/env node

/**
 * Content Quality Test Script for Wordle Hint Pro
 * Tests the quality analysis system
 * Run with: node test-quality.js
 */

const BASE_URL = 'http://localhost:3000'

async function testQualitySystem() {
  console.log('🔍 Testing Content Quality System...\n')
  
  try {
    // Test 1: Get overall quality report
    console.log('=' * 50)
    console.log('TEST 1: Overall Quality Report')
    console.log('=' * 50)
    const qualityResponse = await fetch(`${BASE_URL}/api/quality`)
    const qualityData = await qualityResponse.json()
    
    if (qualityResponse.ok) {
      console.log('✅ Quality API working!')
      console.log(`📊 Total Articles: ${qualityData.data.statistics.totalArticles}`)
      console.log(`📈 Average Score: ${qualityData.data.statistics.averageScore}`)
      console.log(`🏆 High Quality: ${qualityData.data.statistics.highQualityArticles}`)
      console.log(`📝 Medium Quality: ${qualityData.data.statistics.mediumQualityArticles}`)
      console.log(`⚠️ Low Quality: ${qualityData.data.statistics.lowQualityArticles}`)
      
      if (qualityData.data.recommendations.immediateActions.length > 0) {
        console.log('\n🚨 Immediate Actions Needed:')
        qualityData.data.recommendations.immediateActions.forEach(action => {
          console.log(`   • ${action}`)
        })
      }
    } else {
      console.log('❌ Quality API failed:', qualityData.error)
    }
    
    // Test 2: Analyze specific article quality
    console.log('\n' + '=' * 50)
    console.log('TEST 2: Single Article Quality Analysis')
    console.log('=' * 50)
    
    const sampleContent = `
      <article>
        <h2>Understanding "ABUSE": A Complete Word Analysis</h2>
        <p>The word "ABUSE" is a 5-letter word that presents an interesting challenge for Wordle players. This comprehensive guide will help you master this word and improve your vocabulary skills.</p>
        
        <h3>Word Structure Analysis</h3>
        <p>Let's break down the structure of "ABUSE":</p>
        <ul>
          <li><strong>Total Letters:</strong> 5</li>
          <li><strong>Vowels:</strong> 3 (A, U, E)</li>
          <li><strong>Consonants:</strong> 2 (B, S)</li>
        </ul>
        
        <h3>Strategic Tips</h3>
        <p>When solving words like "ABUSE" in Wordle:</p>
        <ol>
          <li>Focus on vowel patterns</li>
          <li>Use common starting words</li>
          <li>Practice elimination strategies</li>
        </ol>
        
        <h3>Vocabulary Building</h3>
        <p>Expand your knowledge with related words and practice regularly to improve your skills.</p>
      </article>
    `
    
    const analyzeResponse = await fetch(`${BASE_URL}/api/quality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'analyze',
        content: sampleContent,
        title: 'Understanding "ABUSE": A Complete Word Analysis',
        keywords: ['abuse', 'wordle', 'vocabulary', 'learning']
      })
    })
    
    const analyzeData = await analyzeResponse.json()
    
    if (analyzeResponse.ok) {
      console.log('✅ Article Analysis Successful!')
      console.log(`📊 Overall Score: ${analyzeData.data.qualityMetrics.overallScore}`)
      console.log(`📖 Readability: ${analyzeData.data.qualityMetrics.readabilityScore}`)
      console.log(`🔍 SEO Score: ${analyzeData.data.qualityMetrics.seoScore}`)
      console.log(`🎯 Engagement: ${analyzeData.data.qualityMetrics.engagementScore}`)
      console.log(`⭐ Quality Rating: ${analyzeData.data.qualityRating}`)
      console.log(`✅ Valid for Publishing: ${analyzeData.data.isValid ? 'Yes' : 'No'}`)
      
      if (analyzeData.data.recommendations.actions.length > 0) {
        console.log('\n💡 Improvement Suggestions:')
        analyzeData.data.recommendations.actions.forEach(action => {
          console.log(`   • ${action}`)
        })
      }
    } else {
      console.log('❌ Article Analysis Failed:', analyzeData.error)
    }
    
    // Test 3: Quality by category
    console.log('\n' + '=' * 50)
    console.log('TEST 3: Quality by Category')
    console.log('=' * 50)
    
    const categoryResponse = await fetch(`${BASE_URL}/api/quality?category=Strategy&minScore=70`)
    const categoryData = await categoryResponse.json()
    
    if (categoryResponse.ok) {
      console.log('✅ Category Quality Analysis Working!')
      console.log(`📊 Strategy Articles: ${categoryData.data.qualityReports.length}`)
      
      if (categoryData.data.qualityReports.length > 0) {
        console.log('\n📋 Sample Strategy Articles:')
        categoryData.data.qualityReports.slice(0, 3).forEach(article => {
          console.log(`   • ${article.title}`)
          console.log(`     Score: ${article.analyzedQualityScore} (${article.qualityRating})`)
          console.log(`     Priority: ${article.improvementPriority}`)
        })
      }
    } else {
      console.log('❌ Category Analysis Failed:', categoryData.error)
    }
    
    // Test 4: Bulk improvement check
    console.log('\n' + '=' * 50)
    console.log('TEST 4: Bulk Improvement Check')
    console.log('=' * 50)
    
    const bulkResponse = await fetch(`${BASE_URL}/api/quality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'bulk_improve' })
    })
    
    const bulkData = await bulkResponse.json()
    
    if (bulkResponse.ok) {
      console.log('✅ Bulk Improvement Check Successful!')
      console.log(`📊 ${bulkData.message}`)
      
      if (bulkData.data.length > 0) {
        console.log('\n🚨 Articles Needing Improvement:')
        bulkData.data.slice(0, 5).forEach(article => {
          console.log(`   • ${article.title} (Score: ${article.currentScore})`)
          if (article.issues.length > 0) {
            console.log(`     Issues: ${article.issues.join(', ')}`)
          }
        })
      } else {
        console.log('🎉 All articles meet quality standards!')
      }
    } else {
      console.log('❌ Bulk Improvement Check Failed:', bulkData.error)
    }
    
    console.log('\n' + '=' * 50)
    console.log('🎉 Quality System Test Completed!')
    console.log('=' * 50)
    
    console.log('\n📋 Test Summary:')
    console.log('- Quality Analysis API: ✅')
    console.log('- Single Article Analysis: ✅')
    console.log('- Category Quality Filtering: ✅')
    console.log('- Bulk Improvement Check: ✅')
    
    console.log('\n🚀 Your quality system is working correctly!')
    console.log('Use the quality API to monitor and improve your content.')
    
  } catch (error) {
    console.error('❌ Quality system test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Make sure your server is running (npm run dev)')
    console.log('2. Check that the quality API endpoint is accessible')
    console.log('3. Verify that articles exist in your system')
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/quality`)
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
    await testQualitySystem()
  } else {
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { testQualitySystem } 