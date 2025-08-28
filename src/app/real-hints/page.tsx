'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, CheckCircle, XCircle, RefreshCw, Globe, Copy, Share2, ArrowUp, Link as LinkIcon } from 'lucide-react'
import Footer from '@/components/Footer'

interface RealHint {
  level: number
  title: string
  description: string
  badge: string
  color: string
  example: string
  tip: string
  isOfficial: boolean
  source: string
}

interface RealHintsData {
  word: string
  wordNumber: number
  date: string
  hints: RealHint[]
  source: string
  isReal: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  officialHintsAvailable: boolean
}

// 智能语义提示生成函数
const generateSemanticHint = (word: string): string => {
  const wordLower = word.toLowerCase()
  
  // 动物相关提示
  if (['loons', 'eagle', 'hawks', 'ducks', 'geese', 'swans', 'heron', 'crane', 'stork'].includes(wordLower)) {
    return 'Think of a bird or flying creature.'
  }
  if (['shark', 'whale', 'dolphin', 'seal', 'otter', 'beaver'].includes(wordLower)) {
    return 'Consider an aquatic or marine animal.'
  }
  if (['tiger', 'lion', 'bear', 'wolf', 'fox', 'deer', 'moose'].includes(wordLower)) {
    return 'Think of a land mammal or wild animal.'
  }
  
  // 自然现象提示
  if (['storm', 'rain', 'snow', 'wind', 'cloud', 'thunder', 'lightning'].includes(wordLower)) {
    return 'Consider weather or atmospheric conditions.'
  }
  if (['ocean', 'river', 'lake', 'mountain', 'forest', 'desert'].includes(wordLower)) {
    return 'Think of geographical features or landscapes.'
  }
  
  // 颜色提示
  if (['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'].includes(wordLower)) {
    return 'This word represents a color.'
  }
  
  // 情感提示
  if (['happy', 'sad', 'angry', 'scared', 'excited', 'calm', 'nervous'].includes(wordLower)) {
    return 'Think of an emotion or feeling.'
  }
  
  // 动作提示
  if (['jump', 'run', 'walk', 'swim', 'fly', 'dance', 'sing', 'laugh', 'cry'].includes(wordLower)) {
    return 'Consider an action or movement.'
  }
  
  // 食物提示
  if (['apple', 'bread', 'cheese', 'pizza', 'steak', 'salad', 'soup'].includes(wordLower)) {
    return 'Think of food or edible items.'
  }
  
  // 职业提示
  if (['teacher', 'doctor', 'nurse', 'lawyer', 'engineer', 'artist', 'writer'].includes(wordLower)) {
    return 'Consider a profession or occupation.'
  }
  
  // 交通工具提示
  if (['car', 'bus', 'train', 'plane', 'boat', 'bike', 'motorcycle'].includes(wordLower)) {
    return 'Think of a vehicle or mode of transportation.'
  }
  
  // 身体部位提示
  if (['head', 'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'heart'].includes(wordLower)) {
    return 'Consider a part of the body.'
  }
  
  // 时间提示
  if (['today', 'yesterday', 'tomorrow', 'morning', 'afternoon', 'evening', 'night'].includes(wordLower)) {
    return 'Think of time-related concepts.'
  }
  
  // 数字提示
  if (['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].includes(wordLower)) {
    return 'This word represents a number.'
  }
  
  // 家庭关系提示
  if (['mother', 'father', 'sister', 'brother', 'daughter', 'son', 'family'].includes(wordLower)) {
    return 'Consider family relationships.'
  }
  
  // 默认提示 - 基于字母特征
  const vowels = wordLower.match(/[aeiou]/g)?.length || 0
  const consonants = wordLower.length - vowels
  
  if (vowels >= 3) {
    return 'This word has many vowels - think of flowing, smooth sounds.'
  } else if (consonants >= 4) {
    return 'This word is consonant-heavy - consider sharp, crisp sounds.'
  } else {
    return 'Think about the word\'s meaning and common usage in English.'
  }
}



// 直接计算单词的函数（用于本地数据生成）
const calculateLocalWord = (dateStr: string): string => {
  const dateSeed = parseInt(dateStr.replace(/-/g, ''), 10)
  
  // 使用与系统后台完全一致的单词列表和算法
  const commonWords = [
    'CRANE', 'STARE', 'SHARE', 'SPARE', 'SCARE', 'SNARE', 'SWARE', 'SLATE', 'STATE', 'SKATE',
    'BRAVE', 'DREAM', 'FLAME', 'GRACE', 'HAPPY', 'JOLLY', 'KNIFE', 'LIGHT', 'MAGIC', 'NIGHT',
    'OCEAN', 'PEACE', 'QUICK', 'RADIO', 'SMART', 'TRAIN', 'UNITE', 'VOICE', 'WATER', 'YOUTH',
    'ZEBRA', 'ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA', 'ETA', 'THETA', 'IOTA',
    'KAPPA', 'LAMBDA', 'MU', 'NU', 'XI', 'OMICRON', 'PI', 'RHO', 'SIGMA', 'TAU',
    'UPSILON', 'PHI', 'CHI', 'PSI', 'OMEGA', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY', 'HUNDRED'
  ]
  
  // 使用与系统后台完全一致的算法
  const wordIndex = (dateSeed * 7 + 13) % commonWords.length
  const selectedWord = commonWords[wordIndex]
  
  console.log(`🔢 calculateLocalWord: date=${dateStr}, seed=${dateSeed}, index=${wordIndex}, word=${selectedWord}`)
  
  return selectedWord
}

// 为本地单词生成提示的函数
const generateLocalHints = (word: string): RealHint[] => {
  const letters = word.split('')
  const first = letters[0]
  const last = letters[letters.length - 1]
  const uniqueCount = new Set(letters).size
  const containsCommon = ['E','A','R','T','O','N','L','S','I'].some(c => word.includes(c))
  const difficulty: 'easy' | 'medium' | 'hard' = word.match(/[AEIOU]/g)?.length && (word.match(/[AEIOU]/g) as RegExpMatchArray).length >= 2 ? 'easy' : 'medium'

  return [
    {
      level: 1,
      title: 'Letter Count',
      description: `Today\'s word has ${letters.length} letters.`,
      badge: 'Basic',
      color: 'blue',
      example: `${'_ '.repeat(letters.length).trim()}`,
      tip: 'Start with common vowels or high-frequency consonants.',
      isOfficial: false,
      source: 'Local Generation'
    },
    {
      level: 2,
      title: 'Starting Letter',
      description: `The word begins with ${first}.`,
      badge: 'Starter',
      color: 'teal',
      example: `${first}${'_ '.repeat(letters.length - 1).trim()}`,
      tip: `Try common English words that start with ${first}.`,
      isOfficial: false,
      source: 'Local Generation'
    },
    {
      level: 3,
      title: 'Ending Letter',
      description: `The word ends with ${last}.`,
      badge: 'Closer',
      color: 'purple',
      example: `${'_ '.repeat(letters.length - 1).trim()}${last}`,
      tip: `Consider common endings like -ED, -ER, -ING.`,
      isOfficial: false,
      source: 'Local Generation'
    },
    {
      level: 4,
      title: 'Common Letters',
      description: containsCommon ? 'Contains high-frequency letters (E/A/R/T/O/N/...).' : 'Does not strongly rely on common letters.',
      badge: 'Frequency',
      color: 'orange',
      example: containsCommon ? 'Examples: REACT, ROAST' : 'Examples: MYTHS, GLYPH',
      tip: 'Adjust your strategy based on letter frequency.',
      isOfficial: false,
      source: 'Local Generation'
    },
    {
      level: 5,
      title: 'Repeated Letters',
      description: uniqueCount < letters.length ? 'This word contains repeated letters.' : 'This word has no repeated letters.',
      badge: 'Pattern',
      color: 'red',
      example: uniqueCount < letters.length ? 'Example: LETTER has double T.' : 'Example: CRANE has no repeats.',
      tip: 'If repeats exist, avoid wasting position checks.',
      isOfficial: false,
      source: 'Local Generation'
    },
    {
      level: 6,
      title: 'Semantic Hint',
      description: generateSemanticHint(word),
      badge: 'Smart',
      color: 'indigo',
      example: 'Think about the meaning, not just letters.',
      tip: 'Use this hint to guide your word choices strategically.',
      isOfficial: false,
      source: 'Local Generation'
    },
    {
      level: 7,
      title: 'Difficulty',
      description: `Overall difficulty: ${difficulty.toUpperCase()}.`,
      badge: 'Summary',
      color: 'green',
      example: 'Use 3–4 broad-coverage guesses to narrow down.',
      tip: 'Combine placement patterns and common collocations.',
      isOfficial: false,
      source: 'Local Generation'
    }
  ]
}

// 获取单词类别的函数
const getWordCategory = (word: string): string => {
  const wordLower = word.toLowerCase()
  
  if (['loons', 'eagle', 'hawks', 'ducks', 'geese', 'swans', 'heron', 'crane', 'stork'].includes(wordLower)) {
    return 'Bird / Flying Animal'
  }
  if (['shark', 'whale', 'dolphin', 'seal', 'otter', 'beaver'].includes(wordLower)) {
    return 'Aquatic / Marine Animal'
  }
  if (['tiger', 'lion', 'bear', 'wolf', 'fox', 'deer', 'moose'].includes(wordLower)) {
    return 'Land Mammal / Wild Animal'
  }
  if (['storm', 'rain', 'snow', 'wind', 'cloud', 'thunder', 'lightning'].includes(wordLower)) {
    return 'Weather / Atmospheric'
  }
  if (['ocean', 'river', 'lake', 'mountain', 'forest', 'desert'].includes(wordLower)) {
    return 'Geography / Landscape'
  }
  if (['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'].includes(wordLower)) {
    return 'Color'
  }
  if (['happy', 'sad', 'angry', 'scared', 'excited', 'calm', 'nervous'].includes(wordLower)) {
    return 'Emotion / Feeling'
  }
  if (['jump', 'run', 'walk', 'swim', 'fly', 'dance', 'sing', 'laugh', 'cry'].includes(wordLower)) {
    return 'Action / Movement'
  }
  if (['apple', 'bread', 'cheese', 'pizza', 'steak', 'salad', 'soup'].includes(wordLower)) {
    return 'Food / Edible Item'
  }
  if (['teacher', 'doctor', 'nurse', 'lawyer', 'engineer', 'artist', 'writer'].includes(wordLower)) {
    return 'Profession / Occupation'
  }
  if (['car', 'bus', 'train', 'plane', 'boat', 'bike', 'motorcycle'].includes(wordLower)) {
    return 'Vehicle / Transportation'
  }
  if (['head', 'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'heart'].includes(wordLower)) {
    return 'Body Part'
  }
  if (['today', 'yesterday', 'tomorrow', 'morning', 'afternoon', 'evening', 'night'].includes(wordLower)) {
    return 'Time / Temporal'
  }
  if (['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].includes(wordLower)) {
    return 'Number'
  }
  if (['mother', 'father', 'sister', 'brother', 'daughter', 'son', 'family'].includes(wordLower)) {
    return 'Family / Relationship'
  }
  
  return 'General / Common Word'
}

// 获取单词关联的函数
const getWordAssociations = (word: string): string => {
  const wordLower = word.toLowerCase()
  
  if (['loons', 'eagle', 'hawks', 'ducks', 'geese', 'swans', 'heron', 'crane', 'stork'].includes(wordLower)) {
    return 'Nature, Wildlife, Flying, Water, Hunting'
  }
  if (['shark', 'whale', 'dolphin', 'seal', 'otter', 'beaver'].includes(wordLower)) {
    return 'Ocean, Water, Swimming, Marine Life'
  }
  if (['tiger', 'lion', 'bear', 'wolf', 'fox', 'deer', 'moose'].includes(wordLower)) {
    return 'Wilderness, Forest, Hunting, Strength'
  }
  if (['storm', 'rain', 'snow', 'wind', 'cloud', 'thunder', 'lightning'].includes(wordLower)) {
    return 'Weather, Sky, Nature, Power'
  }
  if (['ocean', 'river', 'lake', 'mountain', 'forest', 'desert'].includes(wordLower)) {
    return 'Nature, Landscape, Geography, Outdoors'
  }
  if (['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'].includes(wordLower)) {
    return 'Visual, Art, Design, Perception'
  }
  if (['happy', 'sad', 'angry', 'scared', 'excited', 'calm', 'nervous'].includes(wordLower)) {
    return 'Psychology, Mood, Human Experience'
  }
  if (['jump', 'run', 'walk', 'swim', 'fly', 'dance', 'sing', 'laugh', 'cry'].includes(wordLower)) {
    return 'Movement, Activity, Expression, Life'
  }
  if (['apple', 'bread', 'cheese', 'pizza', 'steak', 'salad', 'soup'].includes(wordLower)) {
    return 'Food, Nutrition, Cooking, Taste'
  }
  if (['teacher', 'doctor', 'nurse', 'lawyer', 'engineer', 'artist', 'writer'].includes(wordLower)) {
    return 'Career, Skills, Knowledge, Service'
  }
  if (['car', 'bus', 'train', 'plane', 'boat', 'bike', 'motorcycle'].includes(wordLower)) {
    return 'Transportation, Travel, Technology, Movement'
  }
  if (['head', 'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'heart'].includes(wordLower)) {
    return 'Human Body, Health, Anatomy, Senses'
  }
  if (['today', 'yesterday', 'tomorrow', 'morning', 'afternoon', 'evening', 'night'].includes(wordLower)) {
    return 'Time, Schedule, Daily Life, Planning'
  }
  if (['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].includes(wordLower)) {
    return 'Mathematics, Counting, Order, Quantity'
  }
  if (['mother', 'father', 'sister', 'brother', 'daughter', 'son', 'family'].includes(wordLower)) {
    return 'Relationships, Love, Home, Connection'
  }
  
  return 'Common English word with various meanings'
}

// 生成填字游戏提示的函数
const generateDefinitionHint = (word: string): string => {
  const wordLower = word.toLowerCase()
  if (['loons', 'eagle', 'hawks', 'ducks', 'geese', 'swans', 'heron', 'crane', 'stork'].includes(wordLower)) {
    return 'A bird or flying creature, often associated with water or hunting.'
  }
  if (['shark', 'whale', 'dolphin', 'seal', 'otter', 'beaver'].includes(wordLower)) {
    return 'An aquatic or marine animal, typically found in large bodies of water.'
  }
  if (['tiger', 'lion', 'bear', 'wolf', 'fox', 'deer', 'moose'].includes(wordLower)) {
    return 'A land mammal or wild animal, typically found in forests or wilderness.'
  }
  if (['storm', 'rain', 'snow', 'wind', 'cloud', 'thunder', 'lightning'].includes(wordLower)) {
    return 'A weather phenomenon, often associated with atmospheric conditions.'
  }
  if (['ocean', 'river', 'lake', 'mountain', 'forest', 'desert'].includes(wordLower)) {
    return 'A geographical feature or landscape, typically found on Earth.'
  }
  if (['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'].includes(wordLower)) {
    return 'A color, typically a hue or shade of a primary or secondary color.'
  }
  if (['happy', 'sad', 'angry', 'scared', 'excited', 'calm', 'nervous'].includes(wordLower)) {
    return 'An emotion or feeling, typically a human psychological state.'
  }
  if (['jump', 'run', 'walk', 'swim', 'fly', 'dance', 'sing', 'laugh', 'cry'].includes(wordLower)) {
    return 'An action or movement, typically a physical activity.'
  }
  if (['apple', 'bread', 'cheese', 'pizza', 'steak', 'salad', 'soup'].includes(wordLower)) {
    return 'A food or edible item, typically consumed by humans.'
  }
  if (['teacher', 'doctor', 'nurse', 'lawyer', 'engineer', 'artist', 'writer'].includes(wordLower)) {
    return 'A profession or occupation, typically involving specialized knowledge or skills.'
  }
  if (['car', 'bus', 'train', 'plane', 'boat', 'bike', 'motorcycle'].includes(wordLower)) {
    return 'A vehicle or mode of transportation, typically used for travel.'
  }
  if (['head', 'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'heart'].includes(wordLower)) {
    return 'A part of the human body, typically associated with senses or functions.'
  }
  if (['today', 'yesterday', 'tomorrow', 'morning', 'afternoon', 'evening', 'night'].includes(wordLower)) {
    return 'A time period, typically a 24-hour cycle.'
  }
  if (['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].includes(wordLower)) {
    return 'A number, typically a count or quantity.'
  }
  if (['mother', 'father', 'sister', 'brother', 'daughter', 'son', 'family'].includes(wordLower)) {
    return 'A family relationship, typically involving blood or marriage.'
  }
  
  return 'A word, typically a noun or verb, with a specific meaning.'
}

// 生成上下文提示的函数
const generateContextualHint = (word: string): string => {
  const wordLower = word.toLowerCase()
  if (['loons', 'eagle', 'hawks', 'ducks', 'geese', 'swans', 'heron', 'crane', 'stork'].includes(wordLower)) {
    return 'Think about how these birds are used in literature, art, or everyday life.'
  }
  if (['shark', 'whale', 'dolphin', 'seal', 'otter', 'beaver'].includes(wordLower)) {
    return 'Consider how these animals are depicted in popular culture or how they are used in scientific research.'
  }
  if (['tiger', 'lion', 'bear', 'wolf', 'fox', 'deer', 'moose'].includes(wordLower)) {
    return 'Think about how these animals are portrayed in stories, movies, or how they are used in conservation efforts.'
  }
  if (['storm', 'rain', 'snow', 'wind', 'cloud', 'thunder', 'lightning'].includes(wordLower)) {
    return 'Consider how these weather phenomena are used in poetry, music, or everyday conversation.'
  }
  if (['ocean', 'river', 'lake', 'mountain', 'forest', 'desert'].includes(wordLower)) {
    return 'Think about how these geographical features are used in literature, art, or everyday life.'
  }
  if (['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'].includes(wordLower)) {
    return 'Consider how these colors are used in design, fashion, or everyday objects.'
  }
  if (['happy', 'sad', 'angry', 'scared', 'excited', 'calm', 'nervous'].includes(wordLower)) {
    return 'Think about how these emotions are expressed in art, music, or everyday interactions.'
  }
  if (['jump', 'run', 'walk', 'swim', 'fly', 'dance', 'sing', 'laugh', 'cry'].includes(wordLower)) {
    return 'Consider how these actions are used in storytelling or everyday life.'
  }
  if (['apple', 'bread', 'cheese', 'pizza', 'steak', 'salad', 'soup'].includes(wordLower)) {
    return 'Think about how these foods are used in cooking, recipes, or everyday meals.'
  }
  if (['teacher', 'doctor', 'nurse', 'lawyer', 'engineer', 'artist', 'writer'].includes(wordLower)) {
    return 'Consider how these professions are portrayed in media or how they are valued in society.'
  }
  if (['car', 'bus', 'train', 'plane', 'boat', 'bike', 'motorcycle'].includes(wordLower)) {
    return 'Think about how these vehicles are used in transportation, technology, or everyday life.'
  }
  if (['head', 'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'heart'].includes(wordLower)) {
    return 'Consider how these body parts are used in anatomy, medicine, or everyday interactions.'
  }
  if (['today', 'yesterday', 'tomorrow', 'morning', 'afternoon', 'evening', 'night'].includes(wordLower)) {
    return 'Consider how these time periods are used in scheduling, planning, or everyday routines.'
  }
  if (['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].includes(wordLower)) {
    return 'Consider how these numbers are used in mathematics, counting, or everyday life.'
  }
  if (['mother', 'father', 'sister', 'brother', 'daughter', 'son', 'family'].includes(wordLower)) {
    return 'Consider how these family relationships are portrayed in literature or how they are valued in society.'
  }
  
  return 'Think about how this word is used in everyday language or literature.'
}

// 生成词组游戏提示的函数
const generateWordplayHint = (word: string): string => {
  const wordLower = word.toLowerCase()
  if (['loons', 'eagle', 'hawks', 'ducks', 'geese', 'swans', 'heron', 'crane', 'stork'].includes(wordLower)) {
    return 'Consider how the sound of "loon" or "hawk" might be related to their appearance or behavior.'
  }
  if (['shark', 'whale', 'dolphin', 'seal', 'otter', 'beaver'].includes(wordLower)) {
    return 'Think about how the sound of "shark" or "dolphin" might be related to their appearance or movement.'
  }
  if (['tiger', 'lion', 'bear', 'wolf', 'fox', 'deer', 'moose'].includes(wordLower)) {
    return 'Consider how the sound of "bear" or "wolf" might be related to their appearance or behavior.'
  }
  if (['storm', 'rain', 'snow', 'wind', 'cloud', 'thunder', 'lightning'].includes(wordLower)) {
    return 'Think about how the sound of "thunder" or "lightning" might be related to their appearance or power.'
  }
  if (['ocean', 'river', 'lake', 'mountain', 'forest', 'desert'].includes(wordLower)) {
    return 'Consider how the sound of "mountain" or "forest" might be related to their appearance or environment.'
  }
  if (['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'].includes(wordLower)) {
    return 'Think about how the sound of "purple" or "orange" might be related to their appearance or meaning.'
  }
  if (['happy', 'sad', 'angry', 'scared', 'excited', 'calm', 'nervous'].includes(wordLower)) {
    return 'Consider how the sound of "sad" or "nervous" might be related to their meaning or intensity.'
  }
  if (['jump', 'run', 'walk', 'swim', 'fly', 'dance', 'sing', 'laugh', 'cry'].includes(wordLower)) {
    return 'Think about how the sound of "laugh" or "cry" might be related to their meaning or intensity.'
  }
  if (['apple', 'bread', 'cheese', 'pizza', 'steak', 'salad', 'soup'].includes(wordLower)) {
    return 'Consider how the sound of "bread" or "soup" might be related to their taste or texture.'
  }
  if (['teacher', 'doctor', 'nurse', 'lawyer', 'engineer', 'artist', 'writer'].includes(wordLower)) {
    return 'Consider how the sound of "doctor" or "engineer" might be related to their profession or expertise.'
  }
  if (['car', 'bus', 'train', 'plane', 'boat', 'bike', 'motorcycle'].includes(wordLower)) {
    return 'Consider how the sound of "car" or "train" might be related to their speed or function.'
  }
  if (['head', 'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'heart'].includes(wordLower)) {
    return 'Consider how the sound of "heart" or "mouth" might be related to their function or location.'
  }
  if (['today', 'yesterday', 'tomorrow', 'morning', 'afternoon', 'evening', 'night'].includes(wordLower)) {
    return 'Consider how the sound of "morning" or "night" might be related to their time or darkness.'
  }
  if (['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].includes(wordLower)) {
    return 'Consider how the sound of "one" or "ten" might be related to their quantity or order.'
  }
  if (['mother', 'father', 'sister', 'brother', 'daughter', 'son', 'family'].includes(wordLower)) {
    return 'Consider how the sound of "sister" or "family" might be related to their relationship or group.'
  }
  
  return 'Consider how the sound of this word might be related to its meaning or usage.'
}

// 生成填字游戏文章的函数
const generateWordAnalysisArticle = (word: string): string => {
  const wordLower = word.toLowerCase()
  if (['loons', 'eagle', 'hawks', 'ducks', 'geese', 'swans', 'heron', 'crane', 'stork'].includes(wordLower)) {
    return `Birds, particularly those found near water, have been a subject of fascination and study for centuries. Their ability to fly, hunt, and communicate in complex ways has made them symbols of freedom, strength, and beauty. The word "loon" is derived from the Algonquin word "lone," meaning "one who sings." This bird's distinctive call, often heard on lakes and rivers, is a testament to its adaptability and survival skills. Eagles, hawks, and cranes are also iconic symbols of power and majesty, often depicted as protectors of the natural world. Their keen eyesight and aerial acrobatics make them formidable predators and messengers. Ducks and geese, on the other hand, are symbols of tranquility and community, often found in flocks or nesting in large numbers. Their gentle demeanor and ability to migrate long distances make them symbols of resilience and endurance. The word "swan" is derived from the Old English "swan," meaning "white bird." Swans are often associated with love, peace, and purity, and their graceful flight and elegant appearance make them symbols of elegance and sophistication.`
  }
  if (['shark', 'whale', 'dolphin', 'seal', 'otter', 'beaver'].includes(wordLower)) {
    return `Marine animals, particularly those found in large bodies of water, have fascinated humans for millennia. The word "shark" is derived from the Old English "shar," meaning "to tear." Sharks are often portrayed as fearsome predators, but they play a crucial role in maintaining oceanic ecosystems. Their sharp teeth and streamlined body make them efficient hunters, and their ability to sense even the faintest vibrations in the water makes them formidable predators. Whales, dolphins, and seals are also fascinating creatures. The word "whale" is derived from the Old Norse "hval," meaning "huge fish." Whales are the largest animals on Earth, and their intelligence and ability to communicate underwater make them symbols of power and mystery. Dolphins and seals are often depicted as intelligent and playful, and their ability to dive deep and hold their breath for extended periods make them symbols of strength and endurance.`
  }
  if (['tiger', 'lion', 'bear', 'wolf', 'fox', 'deer', 'moose'].includes(wordLower)) {
    return `Land mammals, particularly those found in forests and wilderness, have been a source of inspiration and fear for centuries. The word "bear" is derived from the Old English "bearan," meaning "to bruise." Bears are often portrayed as fierce and aggressive, but they play a vital role in forest ecosystems as seed dispersers and pollinators. Tigers, lions, and wolves are also powerful symbols of strength and ferocity. Their ability to hunt in packs and their stealthy approach make them formidable predators. Deer and moose, on the other hand, are symbols of grace and agility, often depicted as peaceful and gentle creatures. Their ability to run quickly and evade predators makes them symbols of survival and adaptability.`
  }
  if (['storm', 'rain', 'snow', 'wind', 'cloud', 'thunder', 'lightning'].includes(wordLower)) {
    return `Weather phenomena, particularly those associated with atmospheric conditions, have been a subject of fascination and study for centuries. The word "storm" is derived from the Old English "storm," meaning "a violent wind." Storms are often associated with destruction and chaos, but they also play a crucial role in fertilizing soil and replenishing water resources. Rain, snow, and wind are essential for plant growth and animal survival. Clouds, thunder, and lightning are symbols of power and mystery, often associated with divine intervention or natural phenomena.`
  }
  if (['ocean', 'river', 'lake', 'mountain', 'forest', 'desert'].includes(wordLower)) {
    return `Geographical features and landscapes, particularly those found on Earth, have been a source of inspiration and exploration for humans. Mountains, forests, and deserts are symbols of strength, mystery, and isolation. Their diverse ecosystems and unique flora and fauna make them symbols of resilience and adaptation. Rivers and lakes, on the other hand, are symbols of life and movement, often associated with fertility and renewal. Oceans, with their vastness and depth, are symbols of mystery and power, often associated with the unknown and the deep.`
  }
  if (['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'].includes(wordLower)) {
    return `Colors, particularly those found in nature, have been a source of inspiration and beauty for centuries. Red, blue, green, yellow, purple, orange, pink, brown, black, and white are the primary colors of the visible spectrum. They are often associated with emotions, meanings, and cultural significance. Red is often associated with passion, love, anger, and danger. Blue is often associated with calmness, trust, and reliability. Green is often associated with nature, growth, and harmony. Yellow is often associated with happiness, warmth, and caution. Purple is often associated with royalty, luxury, and mystery. Orange is often associated with creativity, energy, and warmth. Pink is often associated with femininity, love, and gentleness. Brown is often associated with earth, stability, and practicality. Black is often associated with mystery, power, and sophistication. White is often associated with purity, innocence, and simplicity.`
  }
  if (['happy', 'sad', 'angry', 'scared', 'excited', 'calm', 'nervous'].includes(wordLower)) {
    return `Emotions, particularly those experienced by humans, have been a subject of study and expression for centuries. The word "happy" is derived from the Old English "hap," meaning "luck." It is often associated with joy, contentment, and success. "Sad" is derived from the Old English "sæd," meaning "sorrow." It is often associated with grief, loss, and melancholy. "Angry" is derived from the Old English "angor," meaning "to be in pain." It is often associated with frustration, rage, and aggression. "Scared" is derived from the Old English "scari," meaning "to frighten." It is often associated with fear, anxiety, and trepidation. "Excited" is derived from the Old English "excitean," meaning "to stir up." It is often associated with enthusiasm, energy, and anticipation. "Calm" is derived from the Old English "calman," meaning "to be quiet." It is often associated with peace, tranquility, and composure. "Nervous" is derived from the Old English "nerian," meaning "to be in pain." It is often associated with anxiety, fear, and unease.`
  }
  if (['jump', 'run', 'walk', 'swim', 'fly', 'dance', 'sing', 'laugh', 'cry'].includes(wordLower)) {
    return `Actions, particularly those performed by humans, have been a subject of study and expression for centuries. The word "jump" is derived from the Old English "jumpan," meaning "to leap." It is often associated with energy, excitement, and agility. "Run" is derived from the Old English "rannan," meaning "to go quickly." It is often associated with speed, movement, and endurance. "Walk" is derived from the Old English "walan," meaning "to go." It is often associated with movement, progress, and stability. "Swim" is derived from the Old English "swiman," meaning "to swim." It is often associated with water, freedom, and fluidity. "Fly" is derived from the Old English "fligan," meaning "to fly." It is often associated with the sky, freedom, and power. "Dance" is derived from the Old English "dancan," meaning "to dance." It is often associated with joy, celebration, and movement. "Sing" is derived from the Old English "sincan," meaning "to sing." It is often associated with music, expression, and communication. "Laugh" is derived from the Old English "læfan," meaning "to laugh." It is often associated with happiness, joy, and amusement. "Cry" is derived from the Old English "criegen," meaning "to cry." It is often associated with sadness, pain, and distress.`
  }
  if (['apple', 'bread', 'cheese', 'pizza', 'steak', 'salad', 'soup'].includes(wordLower)) {
    return `Food and edible items, particularly those consumed by humans, have been a source of nourishment and enjoyment for centuries. The word "apple" is derived from the Latin "malum," meaning "evil." It is often associated with temptation, sin, and forbidden fruit. "Bread" is derived from the Old English "breod," meaning "food." It is often associated with sustenance, comfort, and community. "Cheese" is derived from the Old French "fromage," meaning "milk." It is often associated with luxury, sophistication, and indulgence. "Pizza" is derived from the Italian "pizza," meaning "flat bread." It is often associated with Italy, fun, and celebration. "Steak" is derived from the Old French "steak," meaning "roasted meat." It is often associated with power, strength, and masculinity. "Salad" is derived from the French "salade," meaning "salted." It is often associated with freshness, health, and simplicity. "Soup" is derived from the Old French "soupe," meaning "soup." It is often associated with warmth, comfort, and nourishment.`
  }
  if (['teacher', 'doctor', 'nurse', 'lawyer', 'engineer', 'artist', 'writer'].includes(wordLower)) {
    return `Professions and occupations, particularly those involving specialized knowledge or skills, have been a source of admiration and respect for centuries. The word "teacher" is derived from the Old English "enseigner," meaning "to teach." It is often associated with knowledge, wisdom, and patience. "Doctor" is derived from the Latin "doctor," meaning "teacher." It is often associated with healing, knowledge, and authority. "Nurse" is derived from the Old English "nurse," meaning "to nurse." It is often associated with care, compassion, and nurturing. "Lawyer" is derived from the Latin "lex," meaning "law." It is often associated with justice, power, and authority. "Engineer" is derived from the Old English "ingener," meaning "to make." It is often associated with innovation, problem-solving, and technology. "Artist" is derived from the Latin "ars," meaning "skill." It is often associated with creativity, expression, and beauty. "Writer" is derived from the Old English "wriþan," meaning "to write." It is often associated with communication, knowledge, and expression.`
  }
  if (['car', 'bus', 'train', 'plane', 'boat', 'bike', 'motorcycle'].includes(wordLower)) {
    return `Vehicles and modes of transportation, particularly those used for travel, have been a source of innovation and progress for centuries. The word "car" is derived from the Latin "carrus," meaning "wheeled vehicle." It is often associated with freedom, independence, and luxury. "Bus" is derived from the Latin "autobus," meaning "public vehicle." It is often associated with community, convenience, and affordability. "Train" is derived from the Latin "trenus," meaning "a vehicle." It is often associated with speed, efficiency, and reliability. "Plane" is derived from the Latin "planus," meaning "flat." It is often associated with the sky, freedom, and power. "Boat" is derived from the Old English "bote," meaning "a vessel." It is often associated with water, travel, and adventure. "Bike" is derived from the German "bick," meaning "two-wheeled vehicle." It is often associated with health, fitness, and freedom. "Motorcycle" is derived from the French "moteur," meaning "engine." It is often associated with speed, power, and excitement.`
  }
  if (['head', 'hand', 'foot', 'eye', 'ear', 'nose', 'mouth', 'heart'].includes(wordLower)) {
    return `Body parts, particularly those associated with senses or functions, have been a source of fascination and study for centuries. The word "head" is derived from the Old English "hād." It is often associated with wisdom, knowledge, and authority. "Hand" is derived from the Old English "hānd." It is often associated with strength, power, and creativity. "Foot" is derived from the Old English "fōt." It is often associated with movement, progress, and stability. "Eye" is derived from the Old English "āg." It is often associated with sight, perception, and wisdom. "Ear" is derived from the Old English "ār." It is often associated with hearing, communication, and understanding. "Nose" is derived from the Old English "nōs." It is often associated with smell, taste, and perception. "Mouth" is derived from the Old English "mōth." It is often associated with speech, communication, and expression. "Heart" is derived from the Old English "hēart." It is often associated with love, passion, and life.`
  }
  if (['today', 'yesterday', 'tomorrow', 'morning', 'afternoon', 'evening', 'night'].includes(wordLower)) {
    return `Time periods, particularly those associated with daily routines and cycles, have been a source of study and expression for centuries. The word "today" is derived from the Old English "tōde." It is often associated with the present, immediacy, and action. "Yesterday" is derived from the Old English "yestærda." It is often associated with the past, nostalgia, and regret. "Tomorrow" is derived from the Old English "tomorra." It is often associated with the future, anticipation, and hope. "Morning" is derived from the Old English "mōrning." It is often associated with the beginning of the day, freshness, and new beginnings. "Afternoon" is derived from the Old French "apres-midi." It is often associated with the middle of the day, relaxation, and leisure. "Evening" is derived from the Old English "eofen." It is often associated with the end of the day, relaxation, and contemplation. "Night" is derived from the Old English "niht." It is often associated with darkness, mystery, and the unknown.`
  }
  if (['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].includes(wordLower)) {
    return `Numbers, particularly those associated with counting and quantity, have been a source of study and expression for centuries. The word "one" is derived from the Old English "on." It is often associated with unity, simplicity, and beginning. "Two" is derived from the Old English "twā." It is often associated with duality, balance, and partnership. "Three" is derived from the Old English "thrēow." It is often associated with fullness, completion, and harmony. "Four" is derived from the Old English "fōr." It is often associated with stability, order, and completion. "Five" is derived from the Old English "fīf." It is often associated with abundance, plenty, and prosperity. "Six" is derived from the Old English "sīx." It is often associated with perfection, harmony, and stability. "Seven" is derived from the Old English "sēow." It is often associated with wisdom, knowledge, and completion. "Eight" is derived from the Old English "eht." It is often associated with abundance, plenty, and prosperity. "Nine" is derived from the Old English "nīu." It is often associated with completion, perfection, and stability. "Ten" is derived from the Old English "tēon." It is often associated with fullness, completion, and perfection.`
  }
  if (['mother', 'father', 'sister', 'brother', 'daughter', 'son', 'family'].includes(wordLower)) {
    return `Family relationships, particularly those involving blood or marriage, have been a source of love, support, and connection for centuries. The word "mother" is derived from the Latin "mater." It is often associated with nurturing, care, and sacrifice. "Father" is derived from the Latin "pater." It is often associated with authority, wisdom, and protection. "Sister" is derived from the Latin "soror." It is often associated with love, support, and companionship. "Brother" is derived from the Latin "frater." It is often associated with strength, unity, and protection. "Daughter" is derived from the Latin "filia." It is often associated with femininity, beauty, and grace. "Son" is derived from the Latin "filius." It is often associated with masculinity, strength, and power. "Family" is derived from the Latin "familia." It is often associated with love, support, and community.`
  }
  
  return `A word, typically a noun or verb, with a specific meaning and usage in English.`
}

export default function RealHintsPage() {
  const [hintsData, setHintsData] = useState<RealHintsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [toast, setToast] = useState<string>('')
  const [copyOk, setCopyOk] = useState<boolean>(false)
  const [detectedArticleWord, setDetectedArticleWord] = useState<string>('')

  useEffect(() => {
    console.log('🚀 useEffect triggered - calling fetchRealHints()')
    
    // 强制立即执行API调用
    const initData = async () => {
      try {
        console.log('🎯 Starting API call...')
        await fetchRealHints()
      } catch (error) {
        console.error('❌ fetchRealHints failed:', error)
        // 如果API调用失败，强制生成本地数据
        const currentDate = new Date().toISOString().slice(0, 10)
        console.log('🏠 API failed, generating local data for:', currentDate)
        generateLocalData(currentDate)
      }
    }
    
    // 立即执行
    initData()
    
    // 如果2秒后还没有数据，强制生成本地数据
    const timeout = setTimeout(() => {
      if (!hintsData) {
        console.log('⏰ Timeout - forcing local data generation')
        const currentDate = new Date().toISOString().slice(0, 10)
        generateLocalData(currentDate)
      }
    }, 2000)
    
    return () => clearTimeout(timeout)
  }, [])

  // 检测页面中的文章单词并自动同步
  useEffect(() => {
    if (hintsData?.word) {
      // 检测页面中是否有文章相关的单词
      const detectArticleWord = () => {
        // 这里可以添加检测逻辑，比如检查URL参数、页面标题等
        // 暂时使用简单的检测方式
        const urlParams = new URLSearchParams(window.location.search);
        const articleWord = urlParams.get('word');
        if (articleWord) {
          return articleWord.toUpperCase();
        }
        
        // 检查页面标题中是否包含特定单词
        const title = document.title;
        if (title.includes('SIXTY')) return 'SIXTY';
        if (title.includes('LOONS')) return 'LOONS';
        
        return hintsData.word;
      };
      
      const detectedWord = detectArticleWord();
      setDetectedArticleWord(detectedWord);
      
      if (detectedWord !== hintsData.word) {
        // 如果检测到不同的单词，可以在这里进行同步操作
        console.log(`Detected article word: ${detectedWord}, syncing hints...`);
        showToast(`Auto-detected article word: ${detectedWord}`);
      }
    }
  }, [hintsData])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  // 生成本地数据的函数
  const generateLocalData = (dateStr: string) => {
    console.log('🏠 Generating local data for date:', dateStr)
    
    // 使用新的计算函数
    const localWord = calculateLocalWord(dateStr)
    
    console.log(`🏠 Local word calculation: date=${dateStr}, word=${localWord}`)
    
    const localHints = generateLocalHints(localWord)
    
    const localData: RealHintsData = {
      word: localWord,
      wordNumber: 0,
      date: dateStr,
      hints: localHints,
      source: 'Local Generation (Offline Mode)',
      isReal: false,
      difficulty: 'medium',
      officialHintsAvailable: false
    }
    
    setHintsData(localData)
    showToast(`Generated local word: ${localWord} (Offline Mode)`)
  }

  const fetchRealHints = async () => {
    console.log('🎯 fetchRealHints function called!')
    try {
      setLoading(true)
      setError(null)

      // 强制使用当前真实日期
      const currentDate = new Date()
      const currentDateStr = currentDate.toISOString().slice(0, 10)
      
      console.log(`🔄 Fetching hints for date: ${currentDateStr}`)

      // 检查网络连接状态
      if (!navigator.onLine) {
        console.log('📱 Device is offline, using local data')
        showToast('Device is offline, using local data')
        generateLocalData(currentDateStr)
        return
      }

      // Prefer requesting Cloudflare Worker directly (browser can access the internet)
      const WORKER_URL = 'https://sparkling-cake-35ce.vnvgtktbcx.workers.dev/today'

      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 5000)
      try {
        // 添加时间戳和缓存破坏参数，强制获取最新数据
        const timestamp = Date.now()
        
        console.log('🌐 Requesting Cloudflare Worker for today\'s data...')
        console.log('🔗 URL:', `${WORKER_URL}?t=${timestamp}&refresh=true&nocache=1`)
        
        const resp = await fetch(`${WORKER_URL}?t=${timestamp}&refresh=true&nocache=1`, { 
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        console.log('📡 Response status:', resp.status, resp.statusText)
        console.log('📡 Response headers:', Object.fromEntries(resp.headers.entries()))
        
        clearTimeout(timer)
        if (resp.ok) {
          const nyt = await resp.json() as Record<string, unknown>
          // Expected fields: solution, id, print_date
          const solution = typeof nyt.solution === 'string' ? nyt.solution : ''
          const wordNumber = typeof nyt.id === 'number' ? nyt.id : Number(nyt.id)
          
          // 使用API返回的真实日期，这是Wordle官方数据
          const apiDate = typeof nyt.print_date === 'string' ? nyt.print_date : ''
          const dateStr = apiDate || currentDateStr
          
          console.log(`✅ API returned: Word: ${solution}, Date: ${apiDate}, Number: ${wordNumber}`)
          
          // 验证API返回的数据是否合理
          if (apiDate && apiDate > currentDateStr) {
            console.warn(`⚠️ API returned future date: ${apiDate}, but this might be correct for different timezones`)
          }
          
          if (solution && solution.length >= 5) {
            const upper = solution.toUpperCase()
            const difficulty: 'easy' | 'medium' | 'hard' = upper.match(/[AEIOU]/g)?.length && (upper.match(/[AEIOU]/g) as RegExpMatchArray).length >= 2 ? 'easy' : 'medium'

            // Generate 6 official-style hints
            const letters = upper.split('')
            const first = letters[0]
            const last = letters[letters.length - 1]
            const uniqueCount = new Set(letters).size
            const containsCommon = ['E','A','R','T','O','N','L','S','I'].some(c => upper.includes(c))

            const hints: RealHint[] = [
              {
                level: 1,
                title: 'Letter Count',
                description: `Today\'s word has ${letters.length} letters.`,
                badge: 'Basic',
                color: 'blue',
                example: `${'_ '.repeat(letters.length).trim()}`,
                tip: 'Start with common vowels or high-frequency consonants.',
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 2,
                title: 'Starting Letter',
                description: `The word begins with ${first}.`,
                badge: 'Starter',
                color: 'teal',
                example: `${first}${'_ '.repeat(letters.length - 1).trim()}`,
                tip: `Try common English words that start with ${first}.`,
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 3,
                title: 'Ending Letter',
                description: `The word ends with ${last}.`,
                badge: 'Closer',
                color: 'purple',
                example: `${'_ '.repeat(letters.length - 1).trim()}${last}`,
                tip: `Consider common endings like -ED, -ER, -ING.`,
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 4,
                title: 'Common Letters',
                description: containsCommon ? 'Contains high-frequency letters (E/A/R/T/O/N/...).' : 'Does not strongly rely on common letters.',
                badge: 'Frequency',
                color: 'orange',
                example: containsCommon ? 'Examples: REACT, ROAST' : 'Examples: MYTHS, GLYPH',
                tip: 'Adjust your strategy based on letter frequency.',
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 5,
                title: 'Repeated Letters',
                description: uniqueCount < letters.length ? 'This word contains repeated letters.' : 'This word has no repeated letters.',
                badge: 'Pattern',
                color: 'red',
                example: uniqueCount < letters.length ? 'Example: LETTER has double T.' : 'Example: CRANE has no repeats.',
                tip: 'If repeats exist, avoid wasting position checks.',
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 6,
                title: 'Semantic Hint',
                description: generateSemanticHint(upper),
                badge: 'Smart',
                color: 'indigo',
                example: 'Think about the meaning, not just letters.',
                tip: 'Use this hint to guide your word choices strategically.',
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              },
              {
                level: 7,
                title: 'Difficulty',
                description: `Overall difficulty: ${difficulty.toUpperCase()}.`,
                badge: 'Summary',
                color: 'green',
                example: 'Use 3–4 broad-coverage guesses to narrow down.',
                tip: 'Combine placement patterns and common collocations.',
                isOfficial: true,
                source: 'Cloudflare Worker • NYT JSON'
              }
            ]

            const data: RealHintsData = {
              word: upper,
              wordNumber: Number.isFinite(wordNumber) && wordNumber > 0 ? wordNumber : 0,
              date: dateStr,
              hints,
              source: 'Cloudflare Worker (NYT official JSON)',
              isReal: true,
              difficulty,
              officialHintsAvailable: true
            }
            setHintsData(data)
            setLoading(false)
            if (isRefreshing) showToast(`Updated to ${upper} · ${dateStr}`)
            return
          }
        }
      } catch (e) {
        console.warn('Direct Worker request failed, falling back to local API', e)
        clearTimeout(timer)
      }

      // 备用方案1: 尝试其他Wordle API
      try {
        console.log('🔄 Trying alternative Wordle API...')
        const altResponse = await fetch('https://wordle-api.vercel.app/api/today', {
          headers: { 'Cache-Control': 'no-cache' },
          signal: AbortSignal.timeout(3000) // 3秒超时
        })
        if (altResponse.ok) {
          const altData = await altResponse.json()
          if (altData.word && altData.word.length === 5) {
            console.log('✅ Got data from alternative API:', altData.word)
            // 使用备用API的数据
            const upper = altData.word.toUpperCase()
            
            // 生成提示数据
            const letters = upper.split('')
            const first = letters[0]
            const last = letters[letters.length - 1]
            const uniqueCount = new Set(letters).size
            const containsCommon = ['E','A','R','T','O','N','L','S','I'].some(c => upper.includes(c))
            const difficulty: 'easy' | 'medium' | 'hard' = upper.match(/[AEIOU]/g)?.length && (upper.match(/[AEIOU]/g) as RegExpMatchArray).length >= 2 ? 'easy' : 'medium'

            const hints: RealHint[] = [
              {
                level: 1,
                title: 'Letter Count',
                description: `Today\'s word has ${letters.length} letters.`,
                badge: 'Basic',
                color: 'blue',
                example: `${'_ '.repeat(letters.length).trim()}`,
                tip: 'Start with common vowels or high-frequency consonants.',
                isOfficial: true,
                source: 'Alternative API • Vercel'
              },
              {
                level: 2,
                title: 'Starting Letter',
                description: `The word begins with ${first}.`,
                badge: 'Starter',
                color: 'teal',
                example: `${first}${'_ '.repeat(letters.length - 1).trim()}`,
                tip: `Try common English words that start with ${first}.`,
                isOfficial: true,
                source: 'Alternative API • Vercel'
              },
              {
                level: 3,
                title: 'Ending Letter',
                description: `The word ends with ${last}.`,
                badge: 'Closer',
                color: 'purple',
                example: `${'_ '.repeat(letters.length - 1).trim()}${last}`,
                tip: `Consider common endings like -ED, -ER, -ING.`,
                isOfficial: true,
                source: 'Alternative API • Vercel'
              },
              {
                level: 4,
                title: 'Common Letters',
                description: containsCommon ? 'Contains high-frequency letters (E/A/R/T/O/N/...).' : 'Does not strongly rely on common letters.',
                badge: 'Frequency',
                color: 'orange',
                example: containsCommon ? 'Examples: REACT, ROAST' : 'Examples: MYTHS, GLYPH',
                tip: 'Adjust your strategy based on letter frequency.',
                isOfficial: true,
                source: 'Alternative API • Vercel'
              },
              {
                level: 5,
                title: 'Repeated Letters',
                description: uniqueCount < letters.length ? 'This word contains repeated letters.' : 'This word has no repeated letters.',
                badge: 'Pattern',
                color: 'red',
                example: uniqueCount < letters.length ? 'Example: LETTER has double T.' : 'Example: CRANE has no repeats.',
                tip: 'If repeats exist, avoid wasting position checks.',
                isOfficial: true,
                source: 'Alternative API • Vercel'
              },
              {
                level: 6,
                title: 'Semantic Hint',
                description: generateSemanticHint(upper),
                badge: 'Smart',
                color: 'indigo',
                example: 'Think about the meaning, not just letters.',
                tip: 'Use this hint to guide your word choices strategically.',
                isOfficial: true,
                source: 'Alternative API • Vercel'
              },
              {
                level: 7,
                title: 'Difficulty',
                description: `Overall difficulty: ${difficulty.toUpperCase()}.`,
                badge: 'Summary',
                color: 'green',
                example: 'Use 3–4 broad-coverage guesses to narrow down.',
                tip: 'Combine placement patterns and common collocations.',
                isOfficial: true,
                source: 'Alternative API • Vercel'
              }
            ]

            const data: RealHintsData = {
              word: upper,
              wordNumber: 0, // 备用API可能没有word number
              date: currentDateStr,
              hints,
              source: 'Alternative API (Vercel) - Fallback',
              isReal: true,
              difficulty,
              officialHintsAvailable: true
            }
            setHintsData(data)
            setLoading(false)
            if (isRefreshing) showToast(`Updated via alternative API: ${upper}`)
            return
          }
        }
      } catch (e) {
        console.warn('Alternative API also failed:', e)
      }

      // 如果所有外部API都失败，直接生成本地数据
      console.log('⚠️ All external APIs failed, generating local data')
      generateLocalData(currentDateStr)
      
    } catch (err) {
      console.error('❌ Failed to fetch real hints:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      // 即使出错也生成本地数据
      generateLocalData(new Date().toISOString().slice(0, 10))
    } finally {
      setLoading(false)
    }
  }

  const refreshHints = async () => {
    setIsRefreshing(true)
    await fetchRealHints()
    setIsRefreshing(false)
  }

  const copyWord = async () => {
    try {
      if (hintsData?.word) {
        await navigator.clipboard.writeText(hintsData.word)
        setCopyOk(true)
        setTimeout(() => setCopyOk(false), 1500)
      }
    } catch {
      showToast('Copy failed')
    }
  }

  const sharePage = async () => {
    try {
      const url = window.location.href
      const nav = navigator as Navigator & { share?: (data: { title?: string; url?: string }) => Promise<void> }
      if (typeof nav.share === 'function') {
        await nav.share({ title: "Today's Wordle", url })
      } else {
        await navigator.clipboard.writeText(url)
        showToast('Link copied')
      }
    } catch {}
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      teal: 'from-teal-500 to-teal-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      green: 'from-green-500 to-green-600',
      indigo: 'from-indigo-500 to-indigo-600'
    }
    return colorMap[color] || 'from-gray-500 to-gray-600'
  }

  const getColorEmoji = (color: string) => {
    const emojiMap: Record<string, string> = {
      blue: '💡',
      teal: '🔍',
      purple: '🎯',
      orange: '⚡',
      red: '🔥',
      green: '✅',
      indigo: '🧠'
    }
    return emojiMap[color] || '❓'
  }

  const getCurrentAnalysisWord = () => {
    if (!hintsData) return 'Loading...';
    
    // 优先使用检测到的文章单词
    if (detectedArticleWord && detectedArticleWord !== hintsData.word) {
      return detectedArticleWord;
    }
    
    // 否则使用Wordle单词
    return hintsData.word;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Fetching real Wordle hints...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">❌ Failed to load hints</h2>
            <p className="text-sm mb-4">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={refreshHints}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                🔄 Retry
              </button>
              <button
                onClick={async () => {
                  // Force use local API without worker
                  try {
                    setLoading(true)
                    const r = await fetch('/api/wordle')
                    const j = await r.json()
                    if (j.success) setHintsData(j.data)
                  } finally { setLoading(false) }
                }}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Use local fallback
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!hintsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">No hints available.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8" id="top">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Lightbulb className="w-10 h-10 text-blue-600 mr-3" />
                Real Wordle Hints
              </h1>
              <p className="text-lg text-gray-600 mb-4">Connected to official Wordle data via Cloudflare Worker</p>
              
              {/* Auto-Sync Status */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200 shadow-lg mb-6 max-w-lg mx-auto">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl">🔄</span>
                  <h3 className="text-lg font-semibold text-blue-800">Auto-Sync Status</h3>
                </div>
                <div className="text-sm text-blue-700">
                  <p>Current Analysis: <span className="font-semibold">{getCurrentAnalysisWord()}</span></p>
                  <p className="text-xs mt-1">Hints automatically sync with the word being analyzed</p>
                  
                  {/* Data Source Status */}
                  {hintsData && (
                    <div className="mt-3 p-2 bg-white rounded border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-1">Data Source Status:</h4>
                      <div className="text-xs space-y-1">
                        <p><strong>Primary API:</strong> {hintsData.source.includes('Cloudflare') ? '✅ Connected' : '❌ Failed'}</p>
                        <p><strong>Data Date:</strong> {hintsData.date}</p>
                        <p><strong>Word:</strong> {hintsData.word}</p>
                        <p><strong>Real-time:</strong> {hintsData.isReal ? '✅ Yes' : '❌ No'}</p>
                      </div>
                      {hintsData.source.includes('Fallback') && (
                        <p className="text-orange-600 text-xs mt-1">
                          ⚠️ Using fallback API due to primary API issues
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {toast && (
                <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm mb-3">{toast}</div>
              )}
              {/* Quick actions */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <button
                  onClick={copyWord}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" /> {copyOk ? 'Copied' : "Copy Today's Word"}
                </button>
                <button
                  onClick={sharePage}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </button>
                        <button
          onClick={async () => {
            try {
              console.log('🧪 Testing API connection...')
              const resp = await fetch('https://sparkling-cake-35ce.vnvgtktbcx.workers.dev/today')
              const data = await resp.json()
              console.log('✅ API test successful:', data)
              showToast(`API test: ${data.solution} (${data.print_date})`)
            } catch (err) {
              console.error('❌ API test failed:', err)
              showToast('API test failed - check console')
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
        >
          🧪 Test API
        </button>
        
        <button
          onClick={() => {
            console.log('🔄 Force refresh clicked')
            const currentDate = new Date().toISOString().slice(0, 10)
            console.log('📅 Current date:', currentDate)
            generateLocalData(currentDate)
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors flex items-center"
        >
          🔄 Force Refresh
        </button>
                <a href="#data-source" className="px-4 py-2 bg-white border text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2" /> Data Source
                </a>
                <a href="#top" className="px-3 py-2 bg-white border text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center">
                  <ArrowUp className="w-4 h-4" />
                </a>
              </div>
              {/* Status Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4">
                {hintsData.isReal ? (
                  <span className="bg-green-100 text-green-800 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Real Data
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    Local Fallback
                  </span>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={refreshHints}
                disabled={isRefreshing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center mx-auto"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Hints'}
              </button>
            </div>

            {/* Today's Wordle Info */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl mb-8">
              {/* Date Warning Banner */}
              {hintsData.date !== new Date().toISOString().slice(0, 10) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="text-lg font-semibold text-red-800">Date Mismatch Warning</h3>
                  </div>
                  <p className="text-red-700 mb-2">
                    <strong>API Date:</strong> {hintsData.date} | <strong>Current Date:</strong> {new Date().toISOString().slice(0, 10)}
                  </p>
                  <p className="text-sm text-red-600">
                    The displayed date ({hintsData.date}) doesn&apos;t match today&apos;s date. 
                    This may indicate API data issues or timezone problems.
                  </p>
                  <button
                    onClick={refreshHints}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    🔄 Refresh Data
                  </button>
                  <button
                    onClick={() => {
                      if (hintsData) {
                        const updatedData = {
                          ...hintsData,
                          date: new Date().toISOString().slice(0, 10)
                        };
                        setHintsData(updatedData);
                        showToast('Forced to use current date');
                      }
                    }}
                    className="mt-3 ml-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    📅 Use Current Date
                  </button>
                </div>
              )}
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Today&apos;s Wordle</h2>
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 inline-block">
                  <div className="text-sm text-gray-600 mb-2">Today&apos;s Word</div>
                  <div className="text-6xl font-bold text-blue-600">{hintsData.word}</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Word #{hintsData.wordNumber} • {hintsData.date}
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>Source: {hintsData.source}</p>
                  <p>Difficulty: {(hintsData.difficulty || 'medium').toUpperCase()}</p>
                  <p>Official Hints: {hintsData.officialHintsAvailable ? '✅ Available' : '❌ Unavailable'}</p>
                  
                  {/* API Data Debug Info */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">API Data Debug:</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>API Word:</strong> {hintsData.word}</p>
                      <p><strong>API Date:</strong> {hintsData.date}</p>
                      <p><strong>Current Date:</strong> {new Date().toISOString().slice(0, 10)}</p>
                      <p><strong>Word Number:</strong> #{hintsData.wordNumber}</p>
                      <p><strong>Data Source:</strong> {hintsData.source}</p>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>💡 <strong>Note:</strong> The word &quot;TOWER&quot; appears to be from a future date (2025-08-28).</p>
                      <p>This suggests the API may be returning test data or incorrect information.</p>
                    </div>
                    
                    {/* Word Selection for Analysis */}
                    <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-2">Choose Word to Analyze:</h5>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            if (hintsData) {
                              const updatedData = { ...hintsData, word: 'SIXTY' };
                              setHintsData(updatedData);
                              showToast('Switched to SIXTY for analysis');
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          SIXTY (Article)
                        </button>
                        <button
                          onClick={() => {
                            if (hintsData) {
                              const updatedData = { ...hintsData, word: 'LOONS' };
                              setHintsData(updatedData);
                              showToast('Switched to LOONS for analysis');
                            }
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          LOONS (Crossword)
                        </button>
                        <button
                          onClick={() => {
                            if (hintsData) {
                              const updatedData = { ...hintsData, word: 'CRANE' };
                              setHintsData(updatedData);
                              showToast('Switched to CRANE for analysis');
                            }
                          }}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                        >
                          CRANE (Common)
                        </button>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        💡 Click any word above to analyze it instead of the API word
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-2 p-2 bg-gray-100 rounded">
                    <span className="font-medium">Date Status:</span> 
                    {hintsData.date === new Date().toISOString().slice(0, 10) ? (
                      <span className="text-green-600 ml-2">✅ Today&apos;s Data</span>
                    ) : (
                      <span className="text-yellow-600 ml-2">⚠️ Data from {hintsData.date}</span>
                    )}
                    <br />
                    <span className="text-xs text-gray-500">Current Date: {new Date().toISOString().slice(0, 10)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Today's Word Semantic Analysis */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-200 shadow-2xl mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center justify-center">
                  <span className="text-2xl mr-3">🧠</span>
                  Smart Analysis for &quot;{getCurrentAnalysisWord()}&quot;
                </h2>
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl p-6 mb-4 border border-indigo-100">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-3">Semantic Hint</h3>
                    <p className="text-lg text-gray-700 italic">&quot;{generateSemanticHint(getCurrentAnalysisWord())}&quot;</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-indigo-100">
                      <h4 className="font-semibold text-indigo-800 mb-2">Word Category</h4>
                      <p className="text-sm text-gray-600">{getWordCategory(getCurrentAnalysisWord())}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-indigo-100">
                      <h4 className="font-semibold text-indigo-800 mb-2">Common Associations</h4>
                      <p className="text-sm text-gray-600">{getWordAssociations(getCurrentAnalysisWord())}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Crossword-Style Hints & Analysis */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-8 border border-green-200 shadow-2xl mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center justify-center">
                  <span className="text-2xl mr-3">🧩</span>
                  Crossword-Style Hints &amp; Analysis
                </h2>
                
                {/* Multiple Hint Types */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                      <span className="text-xl mr-2">💡</span>
                      Definition Hint
                    </h3>
                    <p className="text-gray-700 mb-3">{generateDefinitionHint(getCurrentAnalysisWord())}</p>
                    <div className="text-xs text-green-600 font-medium">Most direct approach</div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                      <span className="text-xl mr-2">🎭</span>
                      Contextual Hint
                    </h3>
                    <p className="text-gray-700 mb-3">{generateContextualHint(getCurrentAnalysisWord())}</p>
                    <div className="text-xs text-green-600 font-medium">Think about usage</div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                      <span className="text-xl mr-2">🔍</span>
                      Wordplay Hint
                    </h3>
                    <p className="text-gray-700 mb-3">{generateWordplayHint(getCurrentAnalysisWord())}</p>
                    <div className="text-xs text-green-600 font-medium">Letter patterns &amp; sounds</div>
                  </div>
                </div>
                
                {/* Analysis Article */}
                <div className="bg-white rounded-2xl p-8 border border-green-100 shadow-lg">
                  <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center">
                    <span className="text-2xl mr-3">📝</span>
                    Word Analysis Article
                  </h3>
                  <div className="prose prose-green max-w-none text-left">
                    <div className="text-gray-700 leading-relaxed">
                      {generateWordAnalysisArticle(getCurrentAnalysisWord())}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Hints Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {hintsData.hints.map((hint, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(hint.color)} rounded-xl flex items-center justify-center text-white`}>
                      <span className="text-lg font-bold">{getColorEmoji(hint.color)}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">{hint.badge}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{hint.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{hint.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700 font-medium mb-1">Example:</p>
                    <p className="text-xs text-gray-600">{hint.example}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 font-medium mb-1">Tip:</p>
                    <p className="text-xs text-gray-600">{hint.tip}</p>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span className={hint.isOfficial ? 'text-green-600' : 'text-yellow-600'}>
                      {hint.isOfficial ? '✅ Official-style' : '🔄 Smart-generated'}
                    </span>
                    <span>Level {hint.level}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Source Information */}
            <div id="data-source" className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 text-blue-600 mr-3" />
                Data Source
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Authenticity:</span>
                      <span className={hintsData.isReal ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                        {hintsData.isReal ? 'Real Data' : 'Local Fallback'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Official Hints:</span>
                      <span className={hintsData.officialHintsAvailable ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                        {hintsData.officialHintsAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <span className="text-gray-900 font-medium">{hintsData.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900 font-medium">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hint Quality</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Hints:</span>
                      <span className="text-gray-900 font-medium">{hintsData.hints.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Official-style:</span>
                      <span className="text-green-600 font-medium">{hintsData.hints.filter(h => h.isOfficial).length} / {hintsData.hints.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="text-gray-900 font-medium">{(hintsData.difficulty || 'medium').toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Word Length:</span>
                      <span className="text-gray-900 font-medium">{hintsData.word.length} letters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 