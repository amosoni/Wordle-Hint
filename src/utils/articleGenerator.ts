import { Article, ArticleTemplate, WordleDailyData } from '@/types/article'
import { ContentQualityAnalyzer } from './qualityAnalyzer'

export class ArticleGenerator {
  private static instance: ArticleGenerator
  private articleTemplates: ArticleTemplate[]

  private constructor() {
    this.articleTemplates = this.initializeTemplates()
  }

  public static getInstance(): ArticleGenerator {
    if (!ArticleGenerator.instance) {
      ArticleGenerator.instance = new ArticleGenerator()
    }
    return ArticleGenerator.instance
  }

  private initializeTemplates(): ArticleTemplate[] {
    return [
      {
        title: 'Understanding "{word}": A Complete Word Analysis',
        category: 'Word Analysis',
        difficulty: 'Beginner',
        readingTime: '3-4 minutes',
        tags: ['vocabulary', 'wordle', 'analysis', 'learning'],
        contentGenerator: this.generateWordAnalysisArticle.bind(this)
      },
      {
        title: 'Wordle Strategy Guide: How to Solve "{word}" and Similar Words',
        category: 'Strategy',
        difficulty: 'Intermediate',
        readingTime: '4-5 minutes',
        tags: ['wordle', 'strategy', 'puzzle', 'tips'],
        contentGenerator: this.generateStrategyArticle.bind(this)
      },
      {
        title: 'Vocabulary Building: "{word}" and Related Words',
        category: 'Vocabulary Building',
        difficulty: 'Beginner',
        readingTime: '3-4 minutes',
        tags: ['vocabulary', 'learning', 'synonyms', 'usage'],
        contentGenerator: this.generateVocabularyArticle.bind(this)
      },
      {
        title: 'Advanced Wordle Techniques: Mastering "{word}"',
        category: 'Advanced Strategy',
        difficulty: 'Advanced',
        readingTime: '5-6 minutes',
        tags: ['wordle', 'advanced', 'techniques', 'mastery'],
        contentGenerator: this.generateAdvancedStrategyArticle.bind(this)
      },
      {
        title: 'Etymology and History: The Story of "{word}"',
        category: 'Language History',
        difficulty: 'Intermediate',
        readingTime: '4-5 minutes',
        tags: ['etymology', 'history', 'language', 'culture'],
        contentGenerator: this.generateEtymologyArticle.bind(this)
      }
    ]
  }

  public async generateArticlesForWord(
    word: string,
    wordData: WordleDailyData
  ): Promise<Article[]> {
    const articles: Article[] = []
    const now = new Date().toISOString()
    
    // 使用Wordle的真实日期，如果没有则使用当前日期
    const articleDate = wordData.date || new Date().toISOString().slice(0, 10)
    const publishedAt = new Date(articleDate + 'T00:00:00.000Z').toISOString()

    for (const template of this.articleTemplates) {
      const article: Article = {
        id: this.generateArticleId(word, template.category),
        title: template.title.replace('{word}', word.toUpperCase()),
        slug: this.generateSlug(word, template.category),
        excerpt: this.generateExcerpt(word, template.category),
        content: template.contentGenerator(word, wordData),
        category: template.category,
        tags: template.tags,
        readingTime: template.readingTime,
        difficulty: template.difficulty,
        qualityScore: this.calculateQualityScore(word, template.category, '', template.title),
        word: word.toUpperCase(),
        wordNumber: wordData.wordNumber,
        publishedAt: publishedAt,
        updatedAt: now,
        status: 'published',
        seoTitle: this.generateSEOTitle(word, template.category),
        seoDescription: this.generateSEODescription(word, template.category),
        author: 'Wordle Hint Pro',
        viewCount: 0,
        likeCount: 0
      }

      articles.push(article)
    }

    return articles
  }

  private generateArticleId(word: string, category: string): string {
    const timestamp = Date.now()
    return `${word.toLowerCase()}-${category.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`
  }

  private generateSlug(word: string, category: string): string {
    return `${category.toLowerCase().replace(/\s+/g, '-')}-${word.toLowerCase()}-${Date.now()}`
  }

  private generateExcerpt(word: string, category: string): string {
    const excerpts = {
      'Word Analysis': `Deep dive into the structure, meaning, and usage of the word "${word.toUpperCase()}" - perfect for vocabulary building and Wordle strategy.`,
      'Strategy': `Master the art of Wordle with proven strategies and techniques. Learn how to approach words like "${word.toUpperCase()}" systematically.`,
      'Vocabulary Building': `Expand your vocabulary with "${word.toUpperCase()}" and discover related words, synonyms, and usage patterns for better language skills.`,
      'Advanced Strategy': `Take your Wordle skills to the next level with advanced techniques and strategies for solving challenging words like "${word.toUpperCase()}".`,
      'Language History': `Explore the fascinating history and origins of "${word.toUpperCase()}" and discover how language evolves over time.`
    }
    return excerpts[category as keyof typeof excerpts] || excerpts['Word Analysis']
  }

  private generateSEOTitle(word: string, category: string): string {
    return `${word.toUpperCase()} Wordle Guide - ${category} | Wordle Hint Pro`
  }

  private generateSEODescription(word: string, category: string): string {
    return `Learn how to solve "${word.toUpperCase()}" in Wordle with our comprehensive ${category.toLowerCase()} guide. Improve your vocabulary and strategy today!`
  }

  private calculateQualityScore(word: string, category: string, content: string, title: string): number {
    // Use quality analyzer for accurate scoring
    const keywords = [word.toLowerCase(), 'wordle', 'vocabulary', 'learning']
    const qualityMetrics = ContentQualityAnalyzer.analyzeContent(content, title, keywords)
    
    // Base score from quality analysis
    let score = qualityMetrics.overallScore
    
    // Category bonus
    const categoryBonus = {
      'Word Analysis': 5,
      'Strategy': 8,
      'Vocabulary Building': 3,
      'Advanced Strategy': 10,
      'Language History': 5
    }
    score += categoryBonus[category as keyof typeof categoryBonus] || 0
    
    // Word length bonus
    if (word.length >= 5) score += 3
    if (word.length >= 6) score += 2
    
    // Ensure score is within bounds and return quality metrics
    const finalScore = Math.min(100, Math.max(40, score))
    
    // Log quality analysis for debugging
    console.log(`Quality Analysis for ${word} - ${category}:`)
    console.log(`  Overall Score: ${finalScore} (${ContentQualityAnalyzer.getQualityRating(finalScore)})`)
    console.log(`  Readability: ${qualityMetrics.readabilityScore}`)
    console.log(`  SEO: ${qualityMetrics.seoScore}`)
    console.log(`  Engagement: ${qualityMetrics.engagementScore}`)
    
    if (qualityMetrics.issues.length > 0) {
      console.log(`  Issues: ${qualityMetrics.issues.join(', ')}`)
      console.log(`  Suggestions: ${qualityMetrics.suggestions.join(', ')}`)
    }
    
    return finalScore
  }

  private generateWordAnalysisArticle(word: string, _wordData: WordleDailyData): string {
    const wordLower = word.toLowerCase()
    const vowels = wordLower.match(/[aeiou]/g) || []
    const consonants = wordLower.match(/[bcdfghjklmnpqrstvwxyz]/g) || []
    void _wordData; void consonants;
    const uniqueLetters = new Set(wordLower.split('')).size
    const syllables = this.estimateSyllables(word)
    const commonness = this.getWordCommonness(word)
    
    return `
      <article class="word-analysis-article">
        <h2>Complete Word Analysis: "${word.toUpperCase()}"</h2>
        
        <section class="overview">
          <h3>Word Overview</h3>
          <p>The word <strong>"${word.toUpperCase()}"</strong> is a ${word.length}-letter word that presents an interesting challenge for Wordle players. Let's break it down systematically to understand its structure and characteristics.</p>
        </section>
        
        <section class="step-by-step-analysis">
          <h3>Step-by-Step Analysis Process</h3>
          
          <div class="step">
            <h4>Step 1: Letter Count Analysis</h4>
            <p><strong>Total Letters:</strong> ${word.length}</p>
            <p><strong>Unique Letters:</strong> ${uniqueLetters}</p>
            <p><strong>Repeated Letters:</strong> ${word.length - uniqueLetters}</p>
            <p>This gives us our first clue: we're looking for a ${word.length}-letter word with ${uniqueLetters} unique characters.</p>
          </div>
          
          <div class="step">
            <h4>Step 2: Vowel-Consonant Distribution</h4>
            <p><strong>Vowels:</strong> ${vowels.length} (${vowels.join(', ').toUpperCase()})</p>
            <p><strong>Consonants:</strong> ${consonants.length} (${consonants.join(', ').toUpperCase()})</p>
            <p><strong>Vowel-Consonant Ratio:</strong> ${vowels.length}:${consonants.length}</p>
            <p>This pattern helps narrow down possibilities. Words with ${vowels.length} vowels and ${consonants.length} consonants follow a specific rhythm.</p>
          </div>
          
          <div class="step">
            <h4>Step 3: Syllable Structure</h4>
            <p><strong>Estimated Syllables:</strong> ${syllables}</p>
            <p><strong>Word Pattern:</strong> ${this.analyzeLetterPattern(word)}</p>
            <p>Understanding syllable structure helps with pronunciation and word recognition.</p>
          </div>
          
          <div class="step">
            <h4>Step 4: Letter Frequency Analysis</h4>
            <p><strong>Most Common Letter:</strong> ${this.getMostFrequentLetter(word)}</p>
            <p><strong>Letter Distribution:</strong> ${this.getLetterDistribution(word)}</p>
            <p>This information is crucial for strategic guessing in Wordle.</p>
          </div>
          
          <div class="step">
            <h4>Step 5: Word Commonness Assessment</h4>
            <p><strong>Commonness Level:</strong> ${commonness}</p>
            <p><strong>Difficulty Rating:</strong> ${this.getDifficultyRating(word)}</p>
            <p>This helps set expectations for how challenging the word might be.</p>
          </div>
        </section>
        
        <section class="practical-applications">
          <h3>Practical Applications for Wordle</h3>
          <ul>
            <li><strong>Starting Words:</strong> Choose words that share similar vowel-consonant patterns</li>
            <li><strong>Letter Elimination:</strong> Focus on the ${vowels.length} vowels and ${consonants.length} consonants</li>
            <li><strong>Pattern Recognition:</strong> Look for words with similar syllable structures</li>
            <li><strong>Strategic Guessing:</strong> Use the letter frequency information to prioritize common letters</li>
          </ul>
        </section>
        
        <section class="learning-tips">
          <h3>Learning Tips</h3>
          <p>To master words like "${word.toUpperCase()}":</p>
          <ol>
            <li>Practice identifying vowel-consonant patterns in everyday words</li>
            <li>Memorize common letter combinations and their frequencies</li>
            <li>Study syllable patterns to improve word recognition</li>
            <li>Use the step-by-step analysis approach for any new word</li>
          </ol>
        </section>
      </article>
    `
  }

  private generateStrategyArticle(word: string, _wordData: WordleDailyData): string {
    const wordLower = word.toLowerCase()
    const vowels = wordLower.match(/[aeiou]/g) || []
    const consonants = wordLower.match(/[bcdfghjklmnpqrstvwxyz]/g) || []
    void _wordData; void consonants;
    
    return `
      <article class="strategy-guide-article">
        <h2>Wordle Strategy Guide: Mastering "${word.toUpperCase()}"</h2>
        
        <section class="strategy-overview">
          <h3>Strategy Overview</h3>
          <p>Successfully solving Wordle requires a systematic approach. This guide will teach you how to tackle words like "${word.toUpperCase()}" using proven strategies and techniques.</p>
        </section>
        
        <section class="step-by-step-strategy">
          <h3>Step-by-Step Wordle Strategy</h3>
          
          <div class="strategy-step">
            <h4>Phase 1: Information Gathering (Guesses 1-2)</h4>
            <p><strong>Goal:</strong> Maximize information about letter positions and frequency</p>
            <p><strong>Recommended Starting Words:</strong></p>
            <ul>
              <li><strong>First Guess:</strong> Use words with common letters (E, A, R, T, O, I, N, S)</li>
              <li><strong>Second Guess:</strong> Choose words that complement your first guess</li>
            </ul>
          </div>
          
          <div class="strategy-step">
            <h4>Phase 2: Pattern Recognition (Guesses 3-4)</h4>
            <p><strong>Goal:</strong> Identify letter patterns and eliminate possibilities</p>
            <p><strong>Key Techniques:</strong></p>
            <ul>
              <li>Look for common letter combinations (TH, CH, SH, ING, ER)</li>
              <li>Identify vowel-consonant patterns</li>
              <li>Use elimination strategy for repeated letters</li>
            </ul>
          </div>
          
          <div class="strategy-step">
            <h4>Phase 3: Strategic Elimination (Guesses 5-6)</h4>
            <p><strong>Goal:</strong> Narrow down to the correct answer</p>
            <p><strong>Advanced Techniques:</strong></p>
            <ul>
              <li>Use process of elimination</li>
              <li>Consider word frequency and commonness</li>
              <li>Apply learned patterns from previous guesses</li>
            </ul>
          </div>
        </section>
        
        <section class="word-specific-strategy">
          <h3>Strategy for "${word.toUpperCase()}"</h3>
          <p>For this specific word:</p>
          <ul>
            <li><strong>Vowel Count:</strong> ${vowels.length} vowels to focus on</li>
            <li><strong>Consonant Pattern:</strong> ${consonants.length} consonants with specific arrangement</li>
            <li><strong>Starting Strategy:</strong> Begin with words containing common vowels like E and A</li>
            <li><strong>Pattern Focus:</strong> Look for words with similar letter distribution</li>
          </ul>
        </section>
      </article>
    `
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateVocabularyArticle(word: string, _wordData: WordleDailyData): string {
    return `
      <article class="vocabulary-building-article">
        <h2>Vocabulary Building: "${word.toUpperCase()}" and Related Words</h2>
        
        <section class="vocabulary-overview">
          <h3>Building Your Vocabulary</h3>
          <p>Expanding your vocabulary is essential for both Wordle success and overall language proficiency. Let's explore "${word.toUpperCase()}" and related words to enhance your linguistic skills.</p>
        </section>
        
        <section class="word-families">
          <h3>Word Families and Related Terms</h3>
          <p>Understanding word families helps you recognize patterns and learn new vocabulary more effectively.</p>
          
          <div class="word-group">
            <h4>Synonyms and Similar Words</h4>
            <ul>
              <li><strong>Related:</strong> Learn words with similar meanings</li>
              <li><strong>Context:</strong> Understand when to use each word</li>
              <li><strong>Nuance:</strong> Appreciate subtle differences in meaning</li>
            </ul>
          </div>
          
          <div class="word-group">
            <h4>Word Formation</h4>
            <ul>
              <li><strong>Prefixes:</strong> Common word beginnings</li>
              <li><strong>Suffixes:</strong> Word endings that change meaning</li>
              <li><strong>Root Words:</strong> Base words that form other words</li>
            </ul>
          </div>
        </section>
        
        <section class="learning-activities">
          <h3>Interactive Learning Activities</h3>
          
          <div class="activity">
            <h4>Daily Word Journal</h4>
            <p>Keep a notebook of new words:</p>
            <ul>
              <li>Write the word and definition</li>
              <li>Create your own example sentence</li>
              <li>Note related words and connections</li>
              <li>Review weekly for reinforcement</li>
            </ul>
          </div>
          
          <div class="activity">
            <h4>Word Games and Puzzles</h4>
            <p>Make learning fun with games:</p>
            <ul>
              <li>Crossword puzzles</li>
              <li>Word searches</li>
              <li>Scrabble or similar word games</li>
              <li>Vocabulary quizzes</li>
            </ul>
          </div>
        </section>
      </article>
    `
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateAdvancedStrategyArticle(word: string, _wordData: WordleDailyData): string {
    return `
      <article class="advanced-strategy-article">
        <h2>Advanced Wordle Techniques: Mastering "${word.toUpperCase()}"</h2>
        
        <section class="advanced-overview">
          <h3>Taking Your Skills to the Next Level</h3>
          <p>Once you've mastered the basics, it's time to explore advanced techniques that can significantly improve your Wordle performance and help you solve challenging words like "${word.toUpperCase()}".</p>
        </section>
        
        <section class="advanced-techniques">
          <h3>Advanced Wordle Techniques</h3>
          
          <div class="technique">
            <h4>Information Theory Approach</h4>
            <p>Use mathematical principles to maximize information gain:</p>
            <ul>
              <li>Calculate entropy of possible words</li>
              <li>Choose guesses that provide maximum information</li>
              <li>Use probability theory for optimal guessing</li>
            </ul>
          </div>
          
          <div class="technique">
            <h4>Pattern Recognition Mastery</h4>
            <p>Develop advanced pattern recognition skills:</p>
            <ul>
              <li>Identify complex letter combinations</li>
              <li>Recognize word structure patterns</li>
              <li>Use linguistic knowledge for better guessing</li>
            </ul>
          </div>
        </section>
      </article>
    `
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateEtymologyArticle(word: string, _wordData: WordleDailyData): string {
    return `
      <article class="etymology-article">
        <h2>Etymology and History: The Story of "${word.toUpperCase()}"</h2>
        
        <section class="etymology-overview">
          <h3>The Fascinating History of Language</h3>
          <p>Every word has a story. Understanding the etymology of "${word.toUpperCase()}" not only enhances your vocabulary but also connects you to the rich history of language development.</p>
        </section>
        
        <section class="word-origins">
          <h3>Origins and Evolution</h3>
          <p>Explore how "${word.toUpperCase()}" came to be and how it has evolved over time:</p>
          
          <div class="origin-detail">
            <h4>Historical Development</h4>
            <p>Trace the word's journey through different languages and time periods.</p>
          </div>
          
          <div class="origin-detail">
            <h4>Cultural Significance</h4>
            <p>Discover how this word reflects cultural changes and societal evolution.</p>
          </div>
        </section>
      </article>
    `
  }

  // Helper methods
  private estimateSyllables(word: string): number {
    const wordLower = word.toLowerCase()
    const syllables = wordLower.match(/[aeiouy]+/g) || []
    return Math.max(1, syllables.length)
  }

  private getWordCommonness(word: string): string {
    const wordLower = word.toLowerCase()
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']
    if (commonWords.includes(wordLower)) return 'Very Common'
    if (wordLower.length <= 4) return 'Common'
    if (wordLower.length <= 6) return 'Moderate'
    return 'Uncommon'
  }

  private analyzeLetterPattern(word: string): string {
    const wordLower = word.toLowerCase()
    const vowels = wordLower.match(/[aeiou]/g) || []
    const consonants = wordLower.match(/[bcdfghjklmnpqrstvwxyz]/g) || []
    return `${vowels.length}V-${consonants.length}C`
  }

  private getMostFrequentLetter(word: string): string {
    const wordLower = word.toLowerCase()
    const letterCount: Record<string, number> = {}
    for (const letter of wordLower) {
      letterCount[letter] = (letterCount[letter] || 0) + 1
    }
    let mostFrequent = ''
    let maxCount = 0
    for (const [letter, count] of Object.entries(letterCount)) {
      if (count > maxCount) {
        maxCount = count
        mostFrequent = letter
      }
    }
    return mostFrequent.toUpperCase()
  }

  private getLetterDistribution(word: string): string {
    const wordLower = word.toLowerCase()
    const letterCount: Record<string, number> = {}
    for (const letter of wordLower) {
      letterCount[letter] = (letterCount[letter] || 0) + 1
    }
    return Object.entries(letterCount)
      .sort(([,a], [,b]) => b - a)
      .map(([letter, count]) => `${letter.toUpperCase()}:${count}`)
      .join(', ')
  }

  private getDifficultyRating(word: string): string {
    const wordLower = word.toLowerCase()
    const vowels = wordLower.match(/[aeiou]/g) || []
    void vowels
    
    if (vowels.length === 0) return 'Very Hard'
    if (vowels.length === 1 && word.length > 5) return 'Hard'
    if (vowels.length >= 2 && word.length <= 5) return 'Easy'
    if (word.length <= 4) return 'Very Easy'
    return 'Medium'
  }
} 