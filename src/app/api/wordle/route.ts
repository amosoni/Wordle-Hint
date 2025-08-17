import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log('Starting simple API request...')
    
    // Return basic data without external API calls
    const basicData = {
      word: "ABOUT",
      source: 'Local Test Data',
      isReal: false,
      date: new Date().toISOString().split('T')[0]
    }
    
    const hints = [
    {
      level: 1,
      title: "Gentle Nudge",
        description: "A subtle hint that gives you a general direction",
      badge: "Level 1",
      color: "blue",
        example: "This word contains 2 vowels and 3 consonants",
        tip: "Focus on the vowel-consonant pattern"
    },
    {
      level: 2,
        title: "Letter Frequency", 
        description: "Information about letter frequency",
      badge: "Level 2",
        color: "cyan",
        example: "Starts with 'A' and ends with 'T'",
        tip: "Use the first and last letters as anchors"
      }
    ]
    
    // Basic educational content
    const basicEducationalContent = {
      wordOrigin: "Basic word origin information",
      funFact: "Interesting fact about this word",
      usageExamples: ["Example sentence 1", "Example sentence 2"],
      pronunciation: "Basic pronunciation guide",
      dailyQuestions: [],
      wordAnalysis: {},
      learningChallenges: [],
      relatedTopics: []
    }
    
    // Helper functions for article generation
function estimateSyllables(word: string): number {
  const wordLower = word.toLowerCase()
  const syllables = wordLower.match(/[aeiouy]+/g) || []
  return Math.max(1, syllables.length)
}

function getWordCommonness(word: string): string {
  const wordLower = word.toLowerCase()
  const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use']
  if (commonWords.includes(wordLower)) return 'Very Common'
  if (wordLower.length <= 4) return 'Common'
  if (wordLower.length <= 6) return 'Moderate'
  return 'Uncommon'
}

function analyzeLetterPattern(word: string): string {
  const wordLower = word.toLowerCase()
  const vowels = wordLower.match(/[aeiou]/g) || []
  const consonants = wordLower.match(/[bcdfghjklmnpqrstvwxyz]/g) || []
  return `${vowels.length}V-${consonants.length}C`
}

function getMostFrequentLetter(word: string): string {
  const wordLower = word.toLowerCase()
  const letterCount: { [key: string]: number } = {}
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

function getLetterDistribution(word: string): string {
  const wordLower = word.toLowerCase()
  const letterCount: { [key: string]: number } = {}
  for (const letter of wordLower) {
    letterCount[letter] = (letterCount[letter] || 0) + 1
  }
  return Object.entries(letterCount)
    .sort(([,a], [,b]) => b - a)
    .map(([letter, count]) => `${letter.toUpperCase()}:${count}`)
    .join(', ')
}

function getDifficultyRating(word: string): string {
  const wordLower = word.toLowerCase()
  const vowels = wordLower.match(/[aeiou]/g) || []
  const uniqueLetters = new Set(wordLower.split('')).size
  
  if (wordLower.length <= 4) return 'Easy'
  if (wordLower.length <= 6 && vowels.length >= 2) return 'Medium'
  if (wordLower.length >= 7 || uniqueLetters >= 6) return 'Hard'
  return 'Medium'
}

function getSynonyms(word: string): Array<{word: string, definition: string}> {
  const wordLower = word.toLowerCase()
  const synonymMap: { [key: string]: Array<{word: string, definition: string}> } = {
    'basic': [
      {word: 'fundamental', definition: 'forming a necessary base or core'},
      {word: 'essential', definition: 'absolutely necessary or extremely important'},
      {word: 'elementary', definition: 'relating to the basic elements of a subject'}
    ],
    'about': [
      {word: 'concerning', definition: 'relating to or about'},
      {word: 'regarding', definition: 'with respect to or concerning'},
      {word: 'pertaining', definition: 'relating to or concerning'}
    ]
  }
  return synonymMap[wordLower] || [
    {word: 'similar', definition: 'resembling without being identical'},
    {word: 'related', definition: 'connected or associated'},
    {word: 'comparable', definition: 'able to be likened to another'}
  ]
}

function generateRelatedWords(word: string): Array<{word: string, relationship: string, definition: string}> {
  const wordLower = word.toLowerCase()
  const relatedMap: { [key: string]: Array<{word: string, relationship: string, definition: string}> } = {
    'basic': [
      {word: 'basics', relationship: 'plural form', definition: 'fundamental principles or facts'},
      {word: 'basically', relationship: 'adverb form', definition: 'in the most important respects'},
      {word: 'base', relationship: 'root word', definition: 'the bottom or foundation'}
    ],
    'about': [
      {word: 'aboutness', relationship: 'noun form', definition: 'the quality of being about something'},
      {word: 'about-face', relationship: 'compound word', definition: 'a complete change of direction'},
      {word: 'roundabout', relationship: 'related concept', definition: 'not direct or straightforward'}
    ]
  }
  return relatedMap[wordLower] || [
    {word: 'word', relationship: 'general term', definition: 'a unit of language'},
    {word: 'term', relationship: 'synonym', definition: 'a word or phrase used to describe something'},
    {word: 'expression', relationship: 'related concept', definition: 'a word or phrase that expresses an idea'}
  ]
}

function getWordDefinition(word: string): string {
  const wordLower = word.toLowerCase()
  const definitionMap: { [key: string]: string } = {
    'basic': 'forming an essential foundation or starting point; fundamental',
    'about': 'on the subject of; concerning',
    'wordle': 'a daily word puzzle game where players guess a five-letter word',
    'puzzle': 'a game, problem, or toy that tests knowledge or thinking',
    'hint': 'a slight or indirect indication or suggestion',
    'strategy': 'a plan of action designed to achieve a long-term or overall aim',
    'vocabulary': 'all the words known and used by a person',
    'learning': 'the acquisition of knowledge or skills through study or experience'
  }
  return definitionMap[wordLower] || 'a unit of language that carries meaning'
}

// Calculate content quality score (0-100)
function calculateContentQuality(word: string, type: string): number {
  let score = 50 // Base score
  
  // Word length bonus
  if (word.length >= 5) score += 10
  if (word.length >= 7) score += 5
  
  // Type-specific bonuses
  switch (type) {
    case "analysis":
      score += 20 // Analysis articles are comprehensive
      break
    case "strategy":
      score += 15 // Strategy guides are practical
      break
    case "vocabulary":
      score += 10 // Vocabulary building is educational
      break
  }
  
  // Word complexity bonus
  const vowels = word.match(/[aeiou]/g) || []
  const consonants = word.match(/[bcdfghjklmnpqrstvwxyz]/g) || []
  if (vowels.length > 2 && consonants.length > 2) score += 10
  
  // Ensure score is within bounds
  return Math.min(100, Math.max(0, score))
}

// Generate educational articles for SEO (NEW)
function generateEducationalArticles(word: string) {
  const wordLower = word.toLowerCase()
  const articles = []
  
  articles.push({
    title: `Understanding "${word.toUpperCase()}": A Complete Word Analysis`,
    slug: `word-analysis-${wordLower}`,
    excerpt: `Deep dive into the structure, meaning, and usage of the word "${word.toUpperCase()}" - perfect for vocabulary building and Wordle strategy.`,
    content: generateWordAnalysisArticle(word),
    category: "Word Analysis",
    tags: ["vocabulary", "wordle", "analysis", "learning"],
    readingTime: "3-4 minutes",
    difficulty: "Beginner",
    qualityScore: calculateContentQuality(word, "analysis")
  })
  
  articles.push({
    title: `Wordle Strategy Guide: How to Solve "${word.toUpperCase()}" and Similar Words`,
    slug: `strategy-guide-${wordLower}`,
    excerpt: `Master the art of Wordle with proven strategies and techniques. Learn how to approach words like "${word.toUpperCase()}" systematically.`,
    content: generateStrategyArticle(word),
    category: "Strategy",
    tags: ["wordle", "strategy", "puzzle", "tips"],
    readingTime: "4-5 minutes",
    difficulty: "Intermediate",
    qualityScore: calculateContentQuality(word, "strategy")
  })
  
  articles.push({
    title: `Vocabulary Building: "${word.toUpperCase()}" and Related Words`,
    slug: `vocabulary-${wordLower}`,
    excerpt: `Expand your vocabulary with "${word.toUpperCase()}" and discover related words, synonyms, and usage patterns for better language skills.`,
    content: generateVocabularyArticle(word),
    category: "Vocabulary Building",
    tags: ["vocabulary", "learning", "synonyms", "usage"],
    readingTime: "3-4 minutes",
    difficulty: "Beginner",
    qualityScore: calculateContentQuality(word, "vocabulary")
  })
  
  return articles
}

    // Generate detailed word analysis article with step-by-step approach
    function generateWordAnalysisArticle(word: string) {
      const wordLower = word.toLowerCase()
      const vowels = wordLower.match(/[aeiou]/g) || []
      const consonants = wordLower.match(/[bcdfghjklmnpqrstvwxyz]/g) || []
      const uniqueLetters = new Set(wordLower.split('')).size
      const syllables = estimateSyllables(word)
      const commonness = getWordCommonness(word)
      
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
              <p><strong>Word Pattern:</strong> ${analyzeLetterPattern(word)}</p>
              <p>Understanding syllable structure helps with pronunciation and word recognition.</p>
            </div>
            
            <div class="step">
              <h4>Step 4: Letter Frequency Analysis</h4>
              <p><strong>Most Common Letter:</strong> ${getMostFrequentLetter(word)}</p>
              <p><strong>Letter Distribution:</strong> ${getLetterDistribution(word)}</p>
              <p>This information is crucial for strategic guessing in Wordle.</p>
            </div>
            
            <div class="step">
              <h4>Step 5: Word Commonness Assessment</h4>
              <p><strong>Commonness Level:</strong> ${commonness}</p>
              <p><strong>Difficulty Rating:</strong> ${getDifficultyRating(word)}</p>
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

    // Generate strategy guide article with actionable steps
    function generateStrategyArticle(word: string) {
      const wordLower = word.toLowerCase()
      const vowels = wordLower.match(/[aeiou]/g) || []
      const consonants = wordLower.match(/[bcdfghjklmnpqrstvwxyz]/g) || []
      
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
              <p><strong>For "${word.toUpperCase()}":</strong> Focus on words containing ${vowels.join(', ').toUpperCase()} and common consonants.</p>
            </div>
            
            <div class="strategy-step">
              <h4>Phase 2: Pattern Recognition (Guesses 3-4)</h4>
              <p><strong>Goal:</strong> Identify the word's structure and eliminate possibilities</p>
              <p><strong>Key Actions:</strong></p>
              <ul>
                <li>Analyze the vowel-consonant pattern (${vowels.length} vowels, ${consonants.length} consonants)</li>
                <li>Look for repeated letters or unique patterns</li>
                <li>Use process of elimination for letter positions</li>
              </ul>
              <p><strong>Pattern Analysis:</strong> "${word.toUpperCase()}" follows a ${analyzeLetterPattern(word)} pattern.</p>
            </div>
            
            <div class="strategy-step">
              <h4>Phase 3: Strategic Elimination (Guesses 4-5)</h4>
              <p><strong>Goal:</strong> Narrow down to the correct word</p>
              <p><strong>Techniques:</strong></p>
              <ul>
                <li>Use yellow letters in different positions to test possibilities</li>
                <li>Eliminate words that don't fit the established pattern</li>
                <li>Consider word frequency and commonness</li>
              </ul>
            </div>
            
            <div class="strategy-step">
              <h4>Phase 4: Final Solution (Guess 6)</h4>
              <p><strong>Goal:</strong> Make the final, educated guess</p>
              <p><strong>Final Checklist:</strong></p>
              <ul>
                <li>Verify all green letters are in correct positions</li>
                <li>Ensure yellow letters appear in different positions</li>
                <li>Confirm the word fits the established pattern</li>
                <li>Double-check for any missed clues</li>
              </ul>
            </div>
          </section>
          
          <section class="advanced-techniques">
            <h3>Advanced Techniques</h3>
            
            <div class="technique">
              <h4>Letter Frequency Strategy</h4>
              <p>Understanding letter frequency in English helps prioritize guesses:</p>
              <ul>
                <li><strong>High Frequency:</strong> E, A, R, T, O, I, N, S</li>
                <li><strong>Medium Frequency:</strong> H, L, U, D, C, M, F, P</li>
                <li><strong>Low Frequency:</strong> V, K, J, X, Q, Z</li>
              </ul>
            </div>
            
            <div class="technique">
              <h4>Positional Analysis</h4>
              <p>Some letters are more common in specific positions:</p>
              <ul>
                <li><strong>First Letter:</strong> S, C, P, T, A, M</li>
                <li><strong>Last Letter:</strong> E, Y, T, R, N, D</li>
                <li><strong>Middle Positions:</strong> Vary based on word length</li>
              </ul>
            </div>
            
            <div class="technique">
              <h4>Word Family Approach</h4>
              <p>Group similar words to improve guessing efficiency:</p>
              <ul>
                <li>Words with similar endings (-ING, -ED, -ER)</li>
                <li>Words with common prefixes (RE-, UN-, IN-)</li>
                <li>Words with similar vowel patterns</li>
              </ul>
            </div>
          </section>
          
          <section class="common-mistakes">
            <h3>Common Mistakes to Avoid</h3>
            <ul>
              <li><strong>Ignoring Letter Position:</strong> Don't just focus on letter presence</li>
              <li><strong>Forgetting Pattern Analysis:</strong> Always consider vowel-consonant distribution</li>
              <li><strong>Rushing Guesses:</strong> Take time to analyze each clue</li>
              <li><strong>Ignoring Word Frequency:</strong> Common words are more likely answers</li>
            </ul>
          </section>
          
          <section class="practice-exercises">
            <h3>Practice Exercises</h3>
            <p>To improve your Wordle skills:</p>
            <ol>
              <li>Practice with words similar to "${word.toUpperCase()}"</li>
              <li>Use the step-by-step strategy on daily puzzles</li>
              <li>Analyze your previous games for patterns</li>
              <li>Study word families and common patterns</li>
            </ol>
          </section>
        </article>
      `
    }

    // Generate vocabulary building article with learning progression
    function generateVocabularyArticle(word: string) {
      const wordLower = word.toLowerCase()
      const synonyms = getSynonyms(word)
      const relatedWords = generateRelatedWords(word)
      
      return `
        <article class="vocabulary-article">
          <h2>Vocabulary Building: "${word.toUpperCase()}" and Related Words</h2>
          
          <section class="word-foundation">
            <h3>Building Your Vocabulary Foundation</h3>
            <p>Learning new words is like building a house - you need a strong foundation. Let's start with "${word.toUpperCase()}" and systematically expand your vocabulary.</p>
          </section>
          
          <section class="step-by-step-learning">
            <h3>Step-by-Step Learning Process</h3>
            
            <div class="learning-step">
              <h4>Step 1: Understanding the Core Word</h4>
              <p><strong>Target Word:</strong> "${word.toUpperCase()}"</p>
              <p><strong>Definition:</strong> ${getWordDefinition(word)}</p>
              <p><strong>Pronunciation:</strong> Practice saying the word correctly</p>
              <p><strong>Part of Speech:</strong> Identify how the word functions in sentences</p>
            </div>
            
            <div class="learning-step">
              <h4>Step 2: Exploring Synonyms</h4>
              <p><strong>Direct Synonyms:</strong></p>
              <ul>
                ${synonyms.map(syn => `<li><strong>${syn.word}:</strong> ${syn.definition}</li>`).join('')}
              </ul>
              <p><strong>Learning Tip:</strong> Understanding subtle differences between synonyms improves precision in communication.</p>
            </div>
            
            <div class="learning-step">
              <h4>Step 3: Discovering Related Words</h4>
              <p><strong>Word Family:</strong></p>
              <ul>
                ${relatedWords.map(rel => `<li><strong>${rel.word}:</strong> ${rel.relationship} - ${rel.definition}</li>`).join('')}
              </ul>
              <p><strong>Pattern Recognition:</strong> Notice how words relate to each other through meaning, form, or origin.</p>
            </div>
            
            <div class="learning-step">
              <h4>Step 4: Context and Usage</h4>
              <p><strong>Example Sentences:</strong></p>
              <ul>
                <li>"The ${wordLower} of the situation became clear after careful analysis."</li>
                <li>"She demonstrated great ${wordLower} in handling the complex problem."</li>
                <li>"Understanding the ${wordLower} requires patience and practice."</li>
              </ul>
            </div>
            
            <div class="learning-step">
              <h4>Step 5: Memory Techniques</h4>
              <p><strong>Mnemonic Devices:</strong></p>
              <ul>
                <li>Create mental images associated with the word</li>
                <li>Use word associations and connections</li>
                <li>Practice active recall through writing and speaking</li>
                <li>Review regularly to reinforce memory</li>
              </ul>
            </div>
          </section>
          
          <section class="vocabulary-expansion">
            <h3>Expanding Your Vocabulary Systematically</h3>
            
            <div class="expansion-method">
              <h4>1. Thematic Learning</h4>
              <p>Group related words by theme or category:</p>
              <ul>
                <li><strong>Emotions:</strong> Happy, joyful, delighted, ecstatic</li>
                <li><strong>Actions:</strong> Run, sprint, dash, race</li>
                <li><strong>Descriptions:</strong> Beautiful, attractive, stunning, gorgeous</li>
              </ul>
            </div>
            
            <div class="expansion-method">
              <h4>2. Root Word Analysis</h4>
              <p>Understanding word origins helps with meaning and spelling:</p>
              <ul>
                <li><strong>Latin Roots:</strong> Bene (good), Mal (bad), Aqua (water)</li>
                <li><strong>Greek Roots:</strong> Tele (far), Bio (life), Geo (earth)</li>
                <li><strong>Prefixes/Suffixes:</strong> Un-, Re-, -tion, -ment</li>
              </ul>
            </div>
            
            <div class="expansion-method">
              <h4>3. Context Clues</h4>
              <p>Learn to infer word meanings from context:</p>
              <ul>
                <li>Look for definitions within the text</li>
                <li>Identify examples or illustrations</li>
                <li>Notice contrast or comparison clues</li>
                <li>Pay attention to tone and mood indicators</li>
              </ul>
            </div>
          </section>
          
          <section class="practice-activities">
            <h3>Practice Activities for Retention</h3>
            
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
            
            <div class="activity">
              <h4>Active Usage</h4>
              <p>Use new words in conversation and writing:</p>
              <ul>
                <li>Incorporate into daily conversations</li>
                <li>Write sentences or short paragraphs</li>
                <li>Create stories using new vocabulary</li>
                <li>Teach others what you've learned</li>
              </ul>
            </div>
          </section>
          
          <section class="progress-tracking">
            <h3>Tracking Your Progress</h3>
            <p>Monitor your vocabulary growth:</p>
            <ul>
              <li><strong>Weekly Goals:</strong> Learn 5-10 new words</li>
              <li><strong>Monthly Review:</strong> Assess retention and understanding</li>
              <li><strong>Long-term Goals:</strong> Build a vocabulary of 1000+ words</li>
              <li><strong>Application:</strong> Use new words in real situations</li>
            </ul>
          </section>
        </article>
      `
    }
    
    // Basic articles
    const basicArticles = generateEducationalArticles(basicData.word)
    
    console.log('Returning basic data successfully')
    
    return NextResponse.json({
      success: true,
      data: {
        word: basicData.word,
        hints: hints,
        source: basicData.source,
        isReal: basicData.isReal,
        date: basicData.date,
        wordNumber: 1,
        apiStatus: 'Local test data',
        // Basic educational content
        educationalContent: basicEducationalContent,
        learningTips: ["Basic learning tip"],
        relatedWords: { synonyms: [], antonyms: [], similar: [] },
        // Basic articles
        articles: basicArticles
      },
    })
  } catch (error) {
    console.error('Error in simple API route:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Simple API route error',
      data: {
        word: "ERROR",
        hints: [],
        source: 'Error',
        isReal: false,
        date: new Date().toISOString().split('T')[0],
        wordNumber: 0,
        apiStatus: 'Error occurred',
        educationalContent: {},
        learningTips: [],
        relatedWords: {},
        articles: []
      },
      error: error instanceof Error ? error.message : String(error),
    }, { status: 200 })
  }
}





