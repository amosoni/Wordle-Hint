export interface QualityMetrics {
  readabilityScore: number
  seoScore: number
  engagementScore: number
  overallScore: number
  issues: string[]
  suggestions: string[]
}

export class ContentQualityAnalyzer {
  public static analyzeContent(content: string, title: string, keywords: string[]): QualityMetrics {
    const readability = this.calculateReadability(content)
    const seo = this.analyzeSEO(content, title, keywords)
    const engagement = this.calculateEngagement(content)
    
    const overall = Math.round((readability * 0.3 + seo * 0.4 + engagement * 0.3))
    
    const issues = this.identifyIssues(content, seo, readability)
    const suggestions = this.generateSuggestions(issues)
    
    return {
      readabilityScore: readability,
      seoScore: seo,
      engagementScore: engagement,
      overallScore: overall,
      issues,
      suggestions
    }
  }

  private static calculateReadability(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).filter(w => w.trim().length > 0)
    
    if (sentences.length === 0 || words.length === 0) return 0
    
    const avgWordsPerSentence = words.length / sentences.length
    const avgWordLength = words.join('').length / words.length
    
    let score = 100
    if (avgWordsPerSentence > 20) score -= 20
    if (avgWordsPerSentence > 25) score -= 20
    if (avgWordLength > 6) score -= 20
    if (avgWordLength > 8) score -= 20
    
    return Math.max(0, score)
  }

  private static analyzeSEO(content: string, title: string, keywords: string[]): number {
    let score = 50
    
    // Keyword density
    const contentLower = content.toLowerCase()
    const totalWords = contentLower.split(/\s+/).length
    let keywordCount = 0
    
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi')
      const matches = contentLower.match(regex)
      if (matches) keywordCount += matches.length
    }
    
    const density = totalWords > 0 ? keywordCount / totalWords : 0
    if (density >= 0.01 && density <= 0.03) score += 20
    else if (density > 0.03) score -= 10
    
    // Title optimization
    const titleLower = title.toLowerCase()
    const titleHasKeywords = keywords.some(k => titleLower.includes(k.toLowerCase()))
    if (titleHasKeywords) score += 15
    
    // Content length
    if (content.length >= 1000) score += 15
    else if (content.length < 500) score -= 20
    
    // Heading structure
    const headings = content.match(/<h[2-6][^>]*>.*?<\/h[2-6]>/gi) || []
    if (headings.length >= 3) score += 10
    
    return Math.max(0, Math.min(100, score))
  }

  private static calculateEngagement(content: string): number {
    let score = 50
    
    // Interactive elements
    if (content.includes('<ul>') || content.includes('<ol>')) score += 10
    if (content.includes('<strong>') || content.includes('<em>')) score += 10
    
    // Practical content
    if (content.includes('Step') || content.includes('Tip')) score += 10
    if (content.includes('Example') || content.includes('Practice')) score += 10
    
    // Actionable content
    const actionWords = ['try', 'practice', 'learn', 'improve', 'focus']
    const actionCount = actionWords.filter(w => content.toLowerCase().includes(w)).length
    score += (actionCount / actionWords.length) * 10
    
    return Math.max(0, Math.min(100, score))
  }

  private static identifyIssues(content: string, seoScore: number, readabilityScore: number): string[] {
    const issues: string[] = []
    
    if (readabilityScore < 40) issues.push('Content is too complex')
    if (seoScore < 50) issues.push('SEO optimization needed')
    if (content.length < 500) issues.push('Content is too short')
    
    return issues
  }

  private static generateSuggestions(issues: string[]): string[] {
    const suggestions: string[] = []
    
    if (issues.includes('Content is too complex')) {
      suggestions.push('Use shorter sentences and simpler vocabulary')
    }
    if (issues.includes('SEO optimization needed')) {
      suggestions.push('Improve keyword usage and content structure')
    }
    if (issues.includes('Content is too short')) {
      suggestions.push('Add more detailed explanations and examples')
    }
    
    return suggestions
  }

  public static getQualityRating(score: number): string {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Poor'
  }

  public static validateContent(metrics: QualityMetrics): boolean {
    return metrics.overallScore >= 70
  }
} 