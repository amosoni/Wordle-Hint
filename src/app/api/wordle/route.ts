import { NextResponse } from 'next/server'

// 单词数据库 - 实际项目中应该从数据库获取
const wordDatabase = [
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE',
  'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA',
  'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWARD', 'AWARE',
  'BADLY', 'BAKER', 'BASES', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW', 'BENCH',
  'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOOST', 'BOOTH',
  'BOUND', 'BRAIN', 'BRAND', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE',
  'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN',
  'CHAIR', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE',
  'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD',
  'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CREAM', 'CRIME', 'CROSS',
  'CROWD', 'CROWN', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT',
  'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRESS', 'DRINK', 'DRIVE',
  'DROVE', 'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY',
  'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH',
  'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED',
  'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND',
  'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN',
  'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAND', 'GRANT', 'GRASS', 'GRAVE', 'GREAT',
  'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HARRY',
  'HEART', 'HEAVY', 'HENCE', 'HENRY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE',
  'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'KNOWN',
  'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE',
  'LEGAL', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOOSE', 'LOWER',
  'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE',
  'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY',
  'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE', 'NEEDS', 'NEVER',
  'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER',
  'OFFER', 'OFFIC', 'OMEGA', 'OPENS', 'ORBIT', 'ORDER', 'OTHER', 'OUTER', 'OWNER', 'PAGE',
  'PAPER', 'PARTY', 'PEACE', 'PETER', 'PHASE', 'PHONE', 'PHOTO', 'PIECE', 'PILOT', 'PITCH',
  'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE',
  'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK',
  'QUIET', 'QUITE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM',
  'REBEL', 'REFER', 'RELAX', 'REPLY', 'RIGHT', 'RIVAL', 'RIVER', 'ROBIN', 'ROGER', 'ROMAN',
  'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SAID', 'SAVE', 'SCALE', 'SCENE', 'SCOPE',
  'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF',
  'SHELL', 'SHIFT', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIGHT', 'SINCE', 'SIXTH',
  'SIXTY', 'SIZED', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE',
  'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND',
  'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE',
  'STEAM', 'STEEL', 'STEER', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM',
  'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET',
  'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEETH', 'TERRY', 'TEXAS', 'THANK', 'THEFT',
  'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE',
  'THREW', 'THROW', 'THUMB', 'TIGER', 'TIGHT', 'TIMER', 'TIRED', 'TITLE', 'TODAY', 'TOPIC',
  'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL',
  'TRIED', 'TRIES', 'TRUCK', 'TRULY', 'TRUST', 'TRUTH', 'TWICE', 'UNDER', 'UNDUE', 'UNION',
  'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO',
  'VIRUS', 'VISIT', 'VITAL', 'VIVID', 'VOCAL', 'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL',
  'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY',
  'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRITE', 'WRONG', 'WROTE', 'YIELD', 'YOUNG',
  'YOUTH'
]

// 提示级别配置
const hintLevels = [
  {
    level: 1,
    title: "Vague Hint",
    description: "A gentle nudge in the right direction",
    badge: "Level 1",
    color: "blue"
  },
  {
    level: 2,
    title: "Specific Hint", 
    description: "More targeted guidance for your strategy",
    badge: "Level 2",
    color: "purple"
  },
  {
    level: 3,
    title: "Direct Hint",
    description: "Clear direction when you're really stuck",
    badge: "Level 3", 
    color: "green"
  }
]

// 生成提示的函数
function generateHints(word: string) {
  const hints = []
  
  for (const level of hintLevels) {
    let hintDescription = ""
    
    switch (level.level) {
      case 1:
        // 模糊提示：单词长度和常见字母
        hintDescription = `This word has ${word.length} letters and contains common letters like ${word.split('').filter((_, i) => word.indexOf(word[i]) === i).slice(0, 3).join(', ')}`
        break
        
      case 2:
        // 具体提示：首尾字母和元音
        const vowels = word.match(/[AEIOU]/g) || []
        hintDescription = `Starts with '${word[0]}', ends with '${word[word.length-1]}', and has ${vowels.length} vowel${vowels.length !== 1 ? 's' : ''}`
        break
        
      case 3:
        // 直接提示：字母位置
        const positions = []
        for (let i = 0; i < word.length; i++) {
          if (i < 2) positions.push(`'${word[i]}' at position ${i+1}`)
        }
        hintDescription = `Letters: ${positions.join(', ')}`
        break
    }
    
    hints.push({
      ...level,
      description: hintDescription
    })
  }
  
  return hints
}

// 获取今天的单词（基于日期种子）
function getTodayWord() {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  
  // 使用种子生成随机索引
  const index = seed % wordDatabase.length
  return wordDatabase[index]
}

export async function GET() {
  try {
    const todayWord = getTodayWord()
    const hints = generateHints(todayWord)
    
    return NextResponse.json({
      success: true,
      data: {
        word: todayWord,
        hints: hints
      }
    })
  } catch (error) {
    console.error('Error generating hints:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate hints'
    }, { status: 500 })
  }
} 