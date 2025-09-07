import { StrandsPuzzle } from '@/types/strands'
import { Article } from '@/types/article'
import { ArticleStorage } from './articleStorage'
import { ContentQualityAnalyzer } from './qualityAnalyzer'

export interface StrandsArticleTemplate {
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  readingTime: string
  tags: string[]
  contentGenerator: (puzzle: StrandsPuzzle) => string
}

export class BlogGenerator {
  private static instance: BlogGenerator
  private articleTemplates: StrandsArticleTemplate[]
  private articleStorage: ArticleStorage

  private constructor() {
    this.articleTemplates = this.initializeTemplates()
    this.articleStorage = ArticleStorage.getInstance()
  }

  public static getInstance(): BlogGenerator {
    if (!BlogGenerator.instance) {
      BlogGenerator.instance = new BlogGenerator()
    }
    return BlogGenerator.instance
  }

  private initializeTemplates(): StrandsArticleTemplate[] {
    return [
      {
        title: 'NYT Strands Hints & Answers for {date} - {theme}',
        category: 'Strands Guide',
        difficulty: 'Beginner',
        readingTime: '4-5 minutes',
        tags: ['strands', 'hints', 'answers', 'nyt', 'puzzle'],
        contentGenerator: this.generateStrandsGuideArticle.bind(this)
      },
      {
        title: 'Strands Strategy: How to Solve "{theme}" Theme Puzzles',
        category: 'Strategy',
        difficulty: 'Intermediate',
        readingTime: '5-6 minutes',
        tags: ['strands', 'strategy', 'puzzle', 'tips', 'techniques'],
        contentGenerator: this.generateStrategyArticle.bind(this)
      },
      {
        title: 'Vocabulary Building: "{theme}" Related Words',
        category: 'Vocabulary Building',
        difficulty: 'Beginner',
        readingTime: '3-4 minutes',
        tags: ['vocabulary', 'learning', 'strands', 'theme', 'words'],
        contentGenerator: this.generateVocabularyArticle.bind(this)
      },
      {
        title: 'Advanced Strands Techniques: Mastering Theme Recognition',
        category: 'Advanced Strategy',
        difficulty: 'Advanced',
        readingTime: '6-7 minutes',
        tags: ['strands', 'advanced', 'techniques', 'pattern-recognition'],
        contentGenerator: this.generateAdvancedStrategyArticle.bind(this)
      },
      {
        title: 'Spangram Mastery: Understanding "{spangram}" and Similar Patterns',
        category: 'Pattern Analysis',
        difficulty: 'Intermediate',
        readingTime: '4-5 minutes',
        tags: ['spangram', 'patterns', 'strands', 'analysis'],
        contentGenerator: this.generateSpangramArticle.bind(this)
      }
    ]
  }

  public async generateArticlesForPuzzle(puzzle: StrandsPuzzle): Promise<Article[]> {
    const articles: Article[] = []
    const now = new Date().toISOString()
    const publishedAt = new Date(puzzle.date + 'T00:00:00.000Z').toISOString()

    for (const template of this.articleTemplates) {
      const article: Article = {
        id: this.generateArticleId(puzzle, template.category),
        title: this.generateTitle(template.title, puzzle),
        slug: this.generateSlug(puzzle, template.category),
        excerpt: this.generateExcerpt(puzzle, template.category),
        content: template.contentGenerator(puzzle),
        category: template.category,
        tags: template.tags,
        readingTime: template.readingTime,
        difficulty: template.difficulty,
        qualityScore: this.calculateQualityScore(puzzle, template.category, template.title),
        word: puzzle.spangram,
        wordNumber: 0,
        publishedAt: publishedAt,
        updatedAt: now,
        status: 'published',
        seoTitle: this.generateSEOTitle(puzzle, template.category),
        seoDescription: this.generateSEODescription(puzzle, template.category),
        author: 'Strands Hint Pro',
        viewCount: 0,
        likeCount: 0,
        type: 'strands',
        theme: puzzle.theme,
        spangram: puzzle.spangram
      }

      articles.push(article)
    }

    return articles
  }

  private generateArticleId(puzzle: StrandsPuzzle, category: string): string {
    const timestamp = Date.now()
    return `strands-${puzzle.date}-${category.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`
  }

  private generateTitle(template: string, puzzle: StrandsPuzzle): string {
    const date = new Date(puzzle.date)
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    return template
      .replace('{date}', formattedDate)
      .replace('{theme}', puzzle.theme)
      .replace('{spangram}', puzzle.spangram)
  }

  private generateSlug(puzzle: StrandsPuzzle, category: string): string {
    const date = new Date(puzzle.date)
    const formattedDate = date.toISOString().slice(0, 10)
    return `strands-${formattedDate}-${category.toLowerCase().replace(/\s+/g, '-')}-${puzzle.theme.toLowerCase().replace(/\s+/g, '-')}`
  }

  private generateExcerpt(puzzle: StrandsPuzzle, category: string): string {
    const excerpts = {
      'Strands Guide': `Complete NYT Strands hints and answers for ${puzzle.theme} theme. Find all words and the spangram with our comprehensive guide.`,
      'Strategy': `Master the art of Strands with proven strategies and techniques. Learn how to solve "${puzzle.theme}" theme puzzles systematically.`,
      'Vocabulary Building': `Expand your vocabulary with "${puzzle.theme}" related words and discover patterns for better Strands performance.`,
      'Advanced Strategy': `Take your Strands skills to the next level with advanced techniques for theme recognition and pattern analysis.`,
      'Pattern Analysis': `Deep dive into spangram patterns and learn how to identify similar structures in Strands puzzles.`
    }
    return excerpts[category as keyof typeof excerpts] || excerpts['Strands Guide']
  }

  private generateSEOTitle(puzzle: StrandsPuzzle, category: string): string {
    const date = new Date(puzzle.date)
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    return `NYT Strands ${formattedDate} - ${puzzle.theme} ${category} | Strands Hint Pro`
  }

  private generateSEODescription(puzzle: StrandsPuzzle, category: string): string {
    return `Learn how to solve NYT Strands "${puzzle.theme}" puzzle with our comprehensive ${category.toLowerCase()} guide. Improve your Strands skills today!`
  }

  private calculateQualityScore(puzzle: StrandsPuzzle, category: string, title: string): number {
    const keywords = [puzzle.theme.toLowerCase(), puzzle.spangram.toLowerCase(), 'strands', 'nyt', 'puzzle']
    const qualityMetrics = ContentQualityAnalyzer.analyzeContent('', title, keywords)
    
    let score = qualityMetrics.overallScore
    
    const categoryBonus = {
      'Strands Guide': 8,
      'Strategy': 10,
      'Vocabulary Building': 5,
      'Advanced Strategy': 12,
      'Pattern Analysis': 9
    }
    score += categoryBonus[category as keyof typeof categoryBonus] || 0
    
    if (puzzle.words.length >= 6) score += 3
    if (puzzle.difficulty === 'hard') score += 2
    
    return Math.min(100, Math.max(40, score))
  }

  private generateStrandsGuideArticle(puzzle: StrandsPuzzle): string {
    const date = new Date(puzzle.date)
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    const wordsList = puzzle.words.map(word => `- **${word.word}**`).join('\n')
    const hintsList = puzzle.hints.map(hint => `- **${hint.title}**: ${hint.content}`).join('\n')

    return `
      <article class="strands-guide-article">
        <h2>NYT Strands Hints & Answers for ${formattedDate}</h2>
        
        <section class="puzzle-overview">
          <h3>Today's Puzzle: "${puzzle.theme}"</h3>
          <p>Today's NYT Strands puzzle features the theme <strong>"${puzzle.theme}"</strong> with the spangram <strong>"${puzzle.spangram}"</strong>.</p>
        </section>
        
        <section class="all-words">
          <h3>All Words to Find:</h3>
          <ul>
            ${wordsList}
          </ul>
        </section>
        
        <section class="hints-section">
          <h3>Progressive Hints (Use Sparingly):</h3>
          <ol>
            ${hintsList}
          </ol>
        </section>
        
        <section class="how-to-play">
          <h3>How to Play Strands:</h3>
          <ol>
            <li>Find all words related to the theme</li>
            <li>One word is the spangram (spans the entire grid)</li>
            <li>Use hints when you're stuck</li>
            <li>Complete the puzzle to win!</li>
          </ol>
        </section>
        
        <section class="tips">
          <h3>Pro Tips:</h3>
          <ul>
            <li>Look for the spangram first - it usually connects multiple words</li>
            <li>Think about the theme and what words might relate to it</li>
            <li>Use the grid layout to your advantage</li>
            <li>Don't be afraid to use hints if you're stuck</li>
          </ul>
        </section>
      </article>
    `
  }

  private generateStrategyArticle(puzzle: StrandsPuzzle): string {
    return `
      <article class="strands-strategy-article">
        <h2>Strands Strategy: How to Solve "${puzzle.theme}" Theme Puzzles</h2>
        
        <section class="strategy-overview">
          <h3>Strategic Approach to Strands</h3>
          <p>Successfully solving Strands requires a systematic approach. This guide will teach you how to tackle "${puzzle.theme}" theme puzzles using proven strategies.</p>
        </section>
        
        <section class="theme-analysis">
          <h3>Theme Analysis: "${puzzle.theme}"</h3>
          <p>Understanding the theme is crucial for success:</p>
          <ul>
            <li><strong>Theme Focus:</strong> All words relate to "${puzzle.theme}"</li>
            <li><strong>Spangram:</strong> The spangram "${puzzle.spangram}" spans the entire grid</li>
            <li><strong>Word Count:</strong> Find ${puzzle.words.length} words total</li>
            <li><strong>Difficulty:</strong> ${puzzle.difficulty} level puzzle</li>
          </ul>
        </section>
        
        <section class="step-by-step-strategy">
          <h3>Step-by-Step Strategy</h3>
          
          <div class="strategy-step">
            <h4>Step 1: Theme Recognition</h4>
            <p>Identify the theme and brainstorm related words before looking at the grid.</p>
          </div>
          
          <div class="strategy-step">
            <h4>Step 2: Spangram Hunt</h4>
            <p>Look for the spangram first - it's usually the longest word and connects multiple areas.</p>
          </div>
          
          <div class="strategy-step">
            <h4>Step 3: Pattern Recognition</h4>
            <p>Use the grid layout to identify word patterns and connections.</p>
          </div>
        </section>
      </article>
    `
  }

  private generateVocabularyArticle(puzzle: StrandsPuzzle): string {
    return `
      <article class="strands-vocabulary-article">
        <h2>Vocabulary Building: "${puzzle.theme}" Related Words</h2>
        
        <section class="vocabulary-overview">
          <h3>Expanding Your "${puzzle.theme}" Vocabulary</h3>
          <p>Building vocabulary around the "${puzzle.theme}" theme will help you excel at Strands puzzles and improve your overall language skills.</p>
        </section>
        
        <section class="word-families">
          <h3>Word Families and Related Terms</h3>
          <p>Understanding word families helps you recognize patterns and learn new vocabulary more effectively.</p>
          
          <div class="word-group">
            <h4>Core Theme Words</h4>
            <ul>
              ${puzzle.words.map(word => `<li><strong>${word.word}</strong> - Related to ${puzzle.theme}</li>`).join('')}
            </ul>
          </div>
          
          <div class="word-group">
            <h4>Spangram Analysis</h4>
            <p>The spangram <strong>"${puzzle.spangram}"</strong> is the key word that spans the entire grid and connects all other words.</p>
          </div>
        </section>
      </article>
    `
  }

  private generateAdvancedStrategyArticle(puzzle: StrandsPuzzle): string {
    return `
      <article class="strands-advanced-article">
        <h2>Advanced Strands Techniques: Mastering Theme Recognition</h2>
        
        <section class="advanced-overview">
          <h3>Advanced Pattern Recognition</h3>
          <p>Master advanced techniques for identifying themes and solving complex Strands puzzles like "${puzzle.theme}".</p>
        </section>
        
        <section class="advanced-techniques">
          <h3>Advanced Techniques</h3>
          
          <div class="technique">
            <h4>Theme Decomposition</h4>
            <p>Break down complex themes into smaller, manageable concepts to identify word patterns.</p>
          </div>
          
          <div class="technique">
            <h4>Grid Analysis</h4>
            <p>Use the grid layout to identify potential word paths and spangram connections.</p>
          </div>
        </section>
      </article>
    `
  }

  private generateSpangramArticle(puzzle: StrandsPuzzle): string {
    return `
      <article class="strands-spangram-article">
        <h2>Spangram Mastery: Understanding "${puzzle.spangram}" and Similar Patterns</h2>
        
        <section class="spangram-overview">
          <h3>Understanding Spangrams</h3>
          <p>The spangram "${puzzle.spangram}" is the key to solving today's Strands puzzle. Learn how to identify and use spangrams effectively.</p>
        </section>
        
        <section class="spangram-analysis">
          <h3>Spangram Analysis</h3>
          <p>Today's spangram "${puzzle.spangram}" connects all other words in the puzzle and spans the entire grid.</p>
        </section>
      </article>
    `
  }

  public async storeArticles(puzzle: StrandsPuzzle): Promise<void> {
    const articles = await this.generateArticlesForPuzzle(puzzle)
    await this.articleStorage.storeArticles(puzzle.theme, articles)
    console.log(`Stored ${articles.length} Strands articles for theme: ${puzzle.theme}`)
  }
}
