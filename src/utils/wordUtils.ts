// Word validation and processing utilities

export const isValidWord = (word: string): boolean => {
  // Check if word is exactly 5 letters and contains only letters
  return /^[A-Za-z]{5}$/.test(word)
}

export const normalizeWord = (word: string): string => {
  return word.trim().toUpperCase()
}

export const getWordScore = (guess: string, target: string): number => {
  let score = 0
  
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      score += 10 // Correct position
    } else if (target.includes(guess[i])) {
      score += 5  // Correct letter, wrong position
    }
  }
  
  return score
}

export const getLetterFrequency = (word: string): Record<string, number> => {
  const frequency: Record<string, number> = {}
  
  for (const letter of word) {
    frequency[letter] = (frequency[letter] || 0) + 1
  }
  
  return frequency
}

export const getCommonPatterns = (word: string): string[] => {
  const patterns: string[] = []
  
  // Check for common letter combinations
  if (word.includes('TH')) patterns.push('TH')
  if (word.includes('CH')) patterns.push('CH')
  if (word.includes('SH')) patterns.push('SH')
  if (word.includes('EA')) patterns.push('EA')
  if (word.includes('AI')) patterns.push('AI')
  if (word.includes('OU')) patterns.push('OU')
  if (word.includes('ST')) patterns.push('ST')
  if (word.includes('SP')) patterns.push('SP')
  
  return patterns
}

export const getVowelCount = (word: string): number => {
  return (word.match(/[AEIOU]/g) || []).length
}



export const isCommonWord = (word: string): boolean => {
  // This would typically check against a dictionary API
  // For now, we'll use a simple heuristic
  const commonWords = [
    'APPLE', 'BEACH', 'CHAIR', 'DREAM', 'EARTH', 'FLAME', 'GRAPE', 'HOUSE',
    'IMAGE', 'JUICE', 'KNIFE', 'LEMON', 'MUSIC', 'NIGHT', 'OCEAN', 'PEACE',
    'QUEEN', 'RADIO', 'SMILE', 'TABLE', 'UNITY', 'VOICE', 'WATER', 'YOUTH'
  ]
  
  return commonWords.includes(word.toUpperCase())
}

export const getWordDifficulty = (word: string): 'easy' | 'medium' | 'hard' => {
  const vowelCount = getVowelCount(word)
  const patterns = getCommonPatterns(word)
  
  let score = 0
  
  // More vowels = easier
  if (vowelCount >= 3) score += 2
  else if (vowelCount >= 2) score += 1
  
  // Common patterns = easier
  score += patterns.length
  
  // Uncommon letters = harder
  const uncommonLetters = word.match(/[QJXZV]/g) || []
  score -= uncommonLetters.length
  
  if (score >= 3) return 'easy'
  if (score >= 0) return 'medium'
  return 'hard'
} 