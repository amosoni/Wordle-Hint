export interface ContentQualityMetrics {
  readabilityScore: number
  seoScore: number
  engagementScore: number
  overallScore: number
  issues: string[]
  suggestions: string[]
}

export interface SEOAnalysis {
  keywordDensity: number
  titleOptimization: number
  metaDescriptionScore: number
  headingStructure: number
  internalLinking: number
  contentLength: number
  uniqueContent: boolean
}

export class ContentQualityAnalyzer {
  private static instance: ContentQualityAnalyzer

  public static getInstance(): ContentQualityAnalyzer {
    if (!ContentQualityAnalyzer.instance) {
      ContentQualityAnalyzer.instance = new ContentQualityAnalyzer()
    }
    return ContentQualityAnalyzer.instance
  }

  /**
   * Analyze content quality comprehensively
   */
  public analyzeContent(
    content: string,
    title: string,
    targetKeywords: string[],
    category: string
  ): ContentQualityMetrics {
    const readabilityScore = this.calculateReadabilityScore(content)
    const seoAnalysis = this.analyzeSEO(content, title, targetKeywords, category)
    const engagementScore = this.calculateEngagementScore(content)
    
    const overallScore = Math.round(
      (readabilityScore * 0.3 + seoAnalysis.seoScore * 0.4 + engagementScore * 0.3)
    )
    
    const issues = this.identifyIssues(content, seoAnalysis, readabilityScore)
    const suggestions = this.generateSuggestions(issues, seoAnalysis)
    
    return {
      readabilityScore,
      seoScore: seoAnalysis.seoScore,
      engagementScore,
      overallScore,
      issues,
      suggestions
    }
  }

  /**
   * Calculate Flesch Reading Ease score
   */
  private calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).filter(w => w.trim().length > 0)
    const syllables = this.countSyllables(content)
    
    if (sentences.length === 0 || words.length === 0) return 0
    
    const fleschScore = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length))
    
    return Math.max(0, Math.min(100, Math.round(fleschScore)))
  }

  /**
   * Count syllables in text
   */
  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/)
    let syllableCount = 0
    
    for (const word of words) {
      syllableCount += this.countWordSyllables(word)
    }
    
    return syllableCount
  }

  /**
   * Count syllables in a single word
   */
  private countWordSyllables(word: string): number {
    if (word.length <= 3) return 1
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '')
    
    const syllables = word.match(/[aeiouy]{1,2}/g)
    return syllables ? Math.max(1, syllables.length) : 1
  }

  /**
   * Analyze SEO aspects of content
   */
  private analyzeSEO(
    content: string,
    title: string,
    targetKeywords: string[],
    _category: string
  ): SEOAnalysis & { seoScore: number } {
    void _category
    const keywordDensity = this.calculateKeywordDensity(content, targetKeywords)
    const titleOptimization = this.analyzeTitleOptimization(title, targetKeywords)
    const metaDescriptionScore = this.analyzeMetaDescription(content, targetKeywords)
    const headingStructure = this.analyzeHeadingStructure(content)
    const internalLinking = this.analyzeInternalLinking(content)
    const contentLength = this.analyzeContentLength(content)
    const uniqueContent = this.checkContentUniqueness(content)
    
    const seoScore = Math.round(
      (keywordDensity * 0.2 +
       titleOptimization * 0.2 +
       metaDescriptionScore * 0.15 +
       headingStructure * 0.15 +
       internalLinking * 0.15 +
       contentLength * 0.15) * 100
    )
    
    return {
      keywordDensity,
      titleOptimization,
      metaDescriptionScore,
      headingStructure,
      internalLinking,
      contentLength,
      uniqueContent,
      seoScore: Math.max(0, Math.min(100, seoScore))
    }
  }

  /**
   * Calculate keyword density
   */
  private calculateKeywordDensity(content: string, keywords: string[]): number {
    if (keywords.length === 0) return 0
    
    const contentLower = content.toLowerCase()
    const totalWords = contentLower.split(/\s+/).length
    let keywordCount = 0
    
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi')
      const matches = contentLower.match(regex)
      if (matches) {
        keywordCount += matches.length
      }
    }
    
    return totalWords > 0 ? keywordCount / totalWords : 0
  }

  /**
   * Analyze title optimization
   */
  private analyzeTitleOptimization(title: string, keywords: string[]): number {
    if (keywords.length === 0) return 0.5
    
    const titleLower = title.toLowerCase()
    let score = 0
    let foundKeywords = 0
    
    for (const keyword of keywords) {
      if (titleLower.includes(keyword.toLowerCase())) {
        foundKeywords++
        if (titleLower.startsWith(keyword.toLowerCase())) {
          score += 0.3
        }
      }
    }
    
    score += (foundKeywords / keywords.length) * 0.7
    return Math.min(1, score)
  }

  /**
   * Analyze meta description
   */
  private analyzeMetaDescription(content: string, keywords: string[]): number {
    if (keywords.length === 0) return 0.5
    
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    const firstParagraph = paragraphs[0] || ''
    
    if (firstParagraph.length < 50 || firstParagraph.length > 160) {
      return 0.3
    }
    
    let score = 0.5
    const paragraphLower = firstParagraph.toLowerCase()
    
    for (const keyword of keywords) {
      if (paragraphLower.includes(keyword.toLowerCase())) {
        score += 0.1
      }
    }
    
    return Math.min(1, score)
  }

  /**
   * Analyze heading structure
   */
  private analyzeHeadingStructure(content: string): number {
    const headings = content.match(/<h[2-6][^>]*>.*?<\/h[2-6]>/gi) || []
    
    if (headings.length === 0) return 0.3
    
    let score = 0.5
    
    if (headings.length >= 3) score += 0.2
    
    const headingLevels = headings.map(h => {
      const match = h.match(/<h([2-6])/i)
      return match ? parseInt(match[1]) : 0
    })
    
    if (headingLevels.every((level, i) => i === 0 || level >= headingLevels[i - 1])) {
      score += 0.3
    }
    
    return Math.min(1, score)
  }

  /**
   * Analyze internal linking
   */
  private analyzeInternalLinking(content: string): number {
    const links = content.match(/<a[^>]*href[^>]*>/gi) || []
    
    if (links.length === 0) return 0.3
    
    let score = 0.5
    
    if (links.length >= 2 && links.length <= 8) score += 0.3
    if (links.length > 8) score += 0.1
    
    return Math.min(1, score)
  }

  /**
   * Analyze content length
   */
  private analyzeContentLength(content: string): number {
    const wordCount = content.split(/\s+/).length
    
    if (wordCount < 300) return 0.2
    if (wordCount < 500) return 0.5
    if (wordCount < 1000) return 0.8
    if (wordCount < 2000) return 1.0
    if (wordCount < 3000) return 0.9
    return 0.7
  }

  /**
   * Check content uniqueness
   */
  private checkContentUniqueness(content: string): boolean {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const phrases = new Set<string>()
    
    for (const sentence of sentences) {
      const words = sentence.trim().split(/\s+/)
      for (let i = 0; i <= words.length - 3; i++) {
        const phrase = words.slice(i, i + 3).join(' ').toLowerCase()
        if (phrases.has(phrase)) {
          return false
        }
        phrases.add(phrase)
      }
    }
    
    return true
  }

  /**
   * Calculate engagement score
   */
  private calculateEngagementScore(content: string): number {
    let score = 0.5
    
    if (content.includes('<ul>') || content.includes('<ol>')) score += 0.1
    if (content.includes('<blockquote>')) score += 0.1
    if (content.includes('<strong>') || content.includes('<em>')) score += 0.1
    
    if (content.includes('Step') || content.includes('Phase')) score += 0.1
    if (content.includes('Tip') || content.includes('Advice')) score += 0.1
    if (content.includes('Example') || content.includes('Practice')) score += 0.1
    
    const actionWords = ['try', 'practice', 'learn', 'master', 'improve', 'focus', 'use']
    const actionWordCount = actionWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length
    
    score += (actionWordCount / actionWords.length) * 0.1
    
    return Math.min(1, score)
  }

  /**
   * Identify content issues
   */
  private identifyIssues(
    content: string,
    seoAnalysis: SEOAnalysis,
    readabilityScore: number
  ): string[] {
    const issues: string[] = []
    
    if (readabilityScore < 30) {
      issues.push('Content is too complex for general audience')
    }
    
    if (seoAnalysis.keywordDensity < 0.01) {
      issues.push('Keyword density is too low')
    } else if (seoAnalysis.keywordDensity > 0.05) {
      issues.push('Keyword density is too high (keyword stuffing)')
    }
    
    if (seoAnalysis.contentLength < 0.5) {
      issues.push('Content is too short for comprehensive coverage')
    }
    
    if (!seoAnalysis.uniqueContent) {
      issues.push('Content contains repetitive phrases')
    }
    
    if (seoAnalysis.headingStructure < 0.5) {
      issues.push('Heading structure needs improvement')
    }
    
    return issues
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(issues: string[], _seo: SEOAnalysis): string[] {
    const suggestions: string[] = []; void _seo
    
    if (issues.includes('Content is too complex for general audience')) {
      suggestions.push('Use shorter sentences and simpler vocabulary')
      suggestions.push('Break down complex concepts into smaller parts')
    }
    
    if (issues.includes('Keyword density is too low')) {
      suggestions.push('Naturally incorporate target keywords throughout the content')
      suggestions.push('Use synonyms and related terms')
    }
    
    if (issues.includes('Keyword density is too high')) {
      suggestions.push('Reduce keyword repetition and focus on natural language')
      suggestions.push('Use LSI (Latent Semantic Indexing) keywords')
    }
    
    if (issues.includes('Content is too short')) {
      suggestions.push('Add more detailed explanations and examples')
      suggestions.push('Include practical tips and actionable advice')
    }
    
    if (issues.includes('Content contains repetitive phrases')) {
      suggestions.push('Vary sentence structure and word choice')
      suggestions.push('Use different ways to express similar ideas')
    }
    
    if (issues.includes('Heading structure needs improvement')) {
      suggestions.push('Organize content with clear H2 and H3 headings')
      suggestions.push('Ensure logical hierarchy of information')
    }
    
    return suggestions
  }

  /**
   * Get quality rating description
   */
  public getQualityRating(score: number): string {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 50) return 'Poor'
    return 'Very Poor'
  }

  /**
   * Validate content before publishing
   */
  public validateContent(metrics: ContentQualityMetrics): boolean {
    return metrics.overallScore >= 70 && metrics.issues.length <= 2
  }
} 