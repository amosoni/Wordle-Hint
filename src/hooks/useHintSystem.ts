'use client'

import { useState, useCallback, useMemo } from 'react'

interface HintLevel {
  level: number
  title: string
  description: string
  hint: string
}

interface HintSystemState {
  currentHint: string
  hintLevel: number
  hintsUsed: number
  maxHints: number
}

// 提示级别配置
const HINT_LEVELS: HintLevel[] = [
  {
    level: 1,
    title: "模糊提示",
    description: "提供方向性指导，不直接透露答案",
    hint: ""
  },
  {
    level: 2,
    title: "具体提示",
    description: "给出更明确的字母位置和组合建议",
    hint: ""
  },
  {
    level: 3,
    title: "直接提示",
    description: "提供最直接的解题线索",
    hint: ""
  }
]

// 智能提示生成逻辑
function generateHint(
  targetWord: string,
  guesses: string[],
  level: number
): string {
  if (guesses.length === 0) {
    return "开始游戏吧！尝试输入一个5字母的单词。"
  }

  const lastGuess = guesses[guesses.length - 1]
  const correctLetters = getCorrectLetters(targetWord, lastGuess)
  const presentLetters = getPresentLetters(targetWord, lastGuess)

  switch (level) {
    case 1:
      return generateLevel1Hint(targetWord, guesses, correctLetters, presentLetters)
    case 2:
      return generateLevel2Hint(targetWord, guesses, correctLetters, presentLetters)
    case 3:
      return generateLevel3Hint(targetWord, guesses, correctLetters)
    default:
      return "继续尝试，你离答案越来越近了！"
  }
}

// 生成第1级提示（模糊提示）
function generateLevel1Hint(
  targetWord: string,
  guesses: string[],
  correctLetters: string[],
  presentLetters: string[]
): string {
  const vowels = ['A', 'E', 'I', 'O', 'U']
  const targetVowels = targetWord.split('').filter(letter => vowels.includes(letter))
  
  if (targetVowels.length > 0) {
    return `这个单词包含元音字母，尝试在中间位置使用常见的元音组合。`
  }
  
  if (correctLetters.length > 0) {
    return `你已经找到了一些正确的字母，继续尝试其他位置。`
  }
  
  if (presentLetters.length > 0) {
    return `有些字母在单词中，但位置不对，尝试重新排列。`
  }
  
  return `观察字母模式，尝试使用常见的字母组合。`
}

// 生成第2级提示（具体提示）
function generateLevel2Hint(
  targetWord: string,
  guesses: string[],
  correctLetters: string[],
  presentLetters: string[]
): string {
  if (correctLetters.length > 0) {
    const positions = correctLetters.map((_, index) => index + 1).join('、')
    return `第${positions}个字母是正确的，尝试在相邻位置使用常见字母。`
  }
  
  if (presentLetters.length > 0) {
    const letterList = presentLetters.join('、')
    return `字母 ${letterList} 在单词中，尝试不同的位置组合。`
  }
  
  // 分析字母频率
  const letterFreq = analyzeLetterFrequency(targetWord)
  const commonLetters = Object.entries(letterFreq)
    .filter(([, count]) => count > 1)
    .map(([letter]) => letter)
    .slice(0, 3)
  
  if (commonLetters.length > 0) {
    return `这个单词包含重复字母：${commonLetters.join('、')}，尝试使用这些字母。`
  }
  
  return `尝试使用常见的字母组合，如 'TH'、'ST'、'CH' 等。`
}

// 生成第3级提示（直接提示）
function generateLevel3Hint(
  targetWord: string,
  guesses: string[],
  correctLetters: string[]
): string {
  if (correctLetters.length >= 3) {
    return `你已经很接近了！尝试组合已知的字母，想想还有什么常见的5字母单词。`
  }
  
  if (correctLetters.length === 2) {
    const positions = correctLetters.map((_, index) => index + 1).join('、')
    return `第${positions}个字母是正确的，尝试在剩余位置使用高频字母。`
  }
  
  // 提供语义提示
  const semanticHint = getSemanticHint(targetWord)
  if (semanticHint) {
    return semanticHint
  }
  
  return `这是最后的提示了！仔细分析已知信息，相信你能找到答案。`
}

// 获取正确位置的字母
function getCorrectLetters(targetWord: string, guess: string): string[] {
  return guess.split('').map((letter, index) => 
    letter === targetWord[index] ? letter : ''
  ).filter(letter => letter !== '')
}

// 获取存在但位置错误的字母
function getPresentLetters(targetWord: string, guess: string): string[] {
  const targetLetters = targetWord.split('')
  const guessLetters = guess.split('')
  const present: string[] = []
  
  guessLetters.forEach((letter, index) => {
    if (letter !== targetWord[index] && targetLetters.includes(letter)) {
      present.push(letter)
      // 避免重复计算
      const targetIndex = targetLetters.indexOf(letter)
      targetLetters[targetIndex] = ''
    }
  })
  
  return present
}

// 分析字母频率
function analyzeLetterFrequency(word: string): Record<string, number> {
  const freq: Record<string, number> = {}
  word.split('').forEach(letter => {
    freq[letter] = (freq[letter] || 0) + 1
  })
  return freq
}

// 获取语义提示
function getSemanticHint(word: string): string | null {
  const semanticHints: Record<string, string> = {
    'APPLE': '这是一种常见的水果，红色或绿色',
    'BEACH': '这是度假时喜欢去的地方',
    'CHAIR': '你正坐在什么上面？',
    'DREAM': '睡觉时大脑会做什么？',
    'EARTH': '我们居住的星球叫什么？',
    'FLAME': '火会产生什么？',
    'GRAPE': '紫色的小水果，一串一串的',
    'HOUSE': '人们居住的建筑',
    'IMAGE': '照片的另一个说法',
    'JUICE': '从水果中榨出的液体',
    'KNIFE': '用来切东西的锋利工具',
    'LEMON': '酸酸的黄色水果',
    'MUSIC': '有节奏和旋律的声音',
    'NIGHT': '太阳下山后的时间',
    'OCEAN': '比海更大的水域',
    'PEACE': '没有战争的状态',
    'QUEEN': '女性统治者',
    'RADIO': '播放音乐的设备',
    'SMILE': '开心时的表情',
    'TABLE': '用来放东西的家具',
    'UNITY': '团结一致的状态',
    'VOICE': '说话时发出的声音',
    'WATER': '生命必需的液体',
    'YOUTH': '年轻时期',
    'ZEBRA': '黑白条纹的动物',
    'ALPHA': '希腊字母表的第一个字母',
    'BRAVE': '勇敢的人',
    'CLOUD': '天空中的白色物体',
    'DANCE': '随着音乐移动身体',
    'EAGLE': '一种猛禽',
    'FAITH': '相信某事的状态',
    'GLORY': '荣誉和赞美'
  }
  
  return semanticHints[word] || null
}

export function useHintSystem() {
  const [hintState, setHintState] = useState<HintSystemState>({
    currentHint: "开始游戏吧！",
    hintLevel: 0,
    hintsUsed: 0,
    maxHints: 3
  })

  // 请求提示
  const requestHint = useCallback((targetWord: string, guesses: string[]) => {
    if (hintState.hintsUsed >= hintState.maxHints) {
      return
    }

    const newLevel = hintState.hintLevel + 1
    const hint = generateHint(targetWord, guesses, newLevel)
    
    setHintState(prev => ({
      ...prev,
      currentHint: hint,
      hintLevel: newLevel,
      hintsUsed: prev.hintsUsed + 1
    }))
  }, [hintState.hintLevel, hintState.hintsUsed, hintState.maxHints])

  // 重置提示系统
  const resetHints = useCallback(() => {
    setHintState({
      currentHint: "开始游戏吧！",
      hintLevel: 0,
      hintsUsed: 0,
      maxHints: 3
    })
  }, [])

  // 获取当前提示级别信息
  const currentHintInfo = useMemo(() => {
    return HINT_LEVELS[hintState.hintLevel] || HINT_LEVELS[0]
  }, [hintState.hintLevel])

  // 检查是否还有提示可用
  const hasHintsLeft = useMemo(() => {
    return hintState.hintsUsed < hintState.maxHints
  }, [hintState.hintsUsed, hintState.maxHints])

  // 获取剩余提示数量
  const hintsLeft = useMemo(() => {
    return hintState.maxHints - hintState.hintsUsed
  }, [hintState.maxHints, hintState.hintsUsed])

  return {
    currentHint: hintState.currentHint,
    hintLevel: hintState.hintLevel,
    hintsUsed: hintState.hintsUsed,
    maxHints: hintState.maxHints,
    hintsLeft,
    hasHintsLeft,
    currentHintInfo,
    requestHint,
    resetHints
  }
} 