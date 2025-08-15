#!/bin/bash

# 🎯 Wordle Hint Pro 完整项目打包脚本
# 这个脚本会创建完整的项目文件结构和所有代码文件

PROJECT_NAME="wordle-hint-pro"
echo "📦 开始创建 $PROJECT_NAME 完整项目包..."

# 创建项目根目录
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# ============================================================================
# 1. 创建 package.json
# ============================================================================
echo "📄 创建 package.json..."
cat > package.json << 'EOF'
{
  "name": "wordle-hint-pro",
  "version": "1.0.0",
  "description": "Smart progressive hint system for Wordle",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "analyze": "cross-env ANALYZE=true next build",
    "prepare": "husky install"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "lucide-react": "^0.400.0",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@next/bundle-analyzer": "^14.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^14.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "playwright": "^1.40.0",
    "cross-env": "^7.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# ============================================================================
# 2. 创建 Next.js 配置文件
# ============================================================================
echo "⚙️ 创建配置文件..."

# next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/hint',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wordle: {
          green: '#6aaa64',
          yellow: '#c9b458',
          gray: '#787c7e',
          dark: '#121213',
          'light-gray': '#d3d6da',
        },
        hint: {
          blue: '#3b82f6',
          'blue-light': '#eff6ff',
          purple: '#8b5cf6',
          'purple-light': '#f3f4f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'scale(1)' },
          '40%, 43%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# ============================================================================
# 3. 创建目录结构
# ============================================================================
echo "📁 创建项目目录结构..."
mkdir -p {app,components,lib,data,docs,tests,public}
mkdir -p app/{api,hint,solver,stats,about}
mkdir -p app/api/{wordle,hints,user,health}
mkdir -p app/hint/[date]
mkdir -p components/{ui,layout,wordle,hints,analytics,shared,pages}
mkdir -p lib/{types,utils,engines,apis,hooks,services,constants}
mkdir -p data/{wordlists,hints,analytics}
mkdir -p tests/{__mocks__,components,lib,api,e2e}

# ============================================================================
# 4. 创建环境和配置文件
# ============================================================================
echo "🔧 创建环境和配置文件..."

# .env.example
cat > .env.example << 'EOF'
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Wordle Hint Pro
NEXT_PUBLIC_APP_VERSION=1.0.0

# 分析和追踪
NEXT_PUBLIC_ANALYTICS_ID=
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# API配置
WORDLE_API_KEY=
WORDLE_API_URL=https://api.nytimes.com/svc/wordle

# 数据库
DATABASE_URL=
REDIS_URL=

# 功能开关
NEXT_PUBLIC_ENABLE_PREMIUM=false
NEXT_PUBLIC_ENABLE_USER_ACCOUNTS=false
NEXT_PUBLIC_MAX_HINTS_PER_DAY=10
EOF

# .env.local
cp .env.example .env.local

# .gitignore
cat > .gitignore << 'EOF'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# custom
*.log
debug.css
playwright-report/
test-results/
EOF

# ============================================================================
# 5. 创建 TypeScript 类型定义
# ============================================================================
echo "📝 创建 TypeScript 类型定义..."

# lib/types/wordle.ts
cat > lib/types/wordle.ts << 'EOF'
export interface WordleData {
  wordleNumber: number
  date: string
  answer?: string // 仅历史数据包含
  difficulty: 'easy' | 'medium' | 'hard'
  averageGuesses: number
}

export interface WordleGuess {
  word: string
  result: LetterStatus[]
  timestamp: Date
}

export type LetterStatus = 'correct' | 'present' | 'absent' | 'unknown'

export interface LetterInfo {
  letter: string
  status: LetterStatus
  position?: number
}
EOF

# lib/types/hint.ts
cat > lib/types/hint.ts << 'EOF'
export type HintLevel = 1 | 2 | 3 | 4 | 5

export interface HintData {
  level: HintLevel
  type: HintType
  title: string
  content: string
  confidence: number
  revealed: boolean
  timestamp?: Date
}

export type HintType = 
  | 'basic'       // 基础信息
  | 'strategic'   // 策略建议
  | 'contextual'  // 语境提示
  | 'structural'  // 结构提示
  | 'emergency'   // 紧急救援

export interface HintRequest {
  wordleNumber: number
  level: HintLevel
  userGuesses: string[]
  excludeKnownInfo?: boolean
}
EOF

# lib/types/user.ts
cat > lib/types/user.ts << 'EOF'
export interface UserProgress {
  userId: string
  totalGames: number
  totalHintsUsed: number
  averageHintsPerGame: number
  currentStreak: number
  longestStreak: number
  lastPlayed: string
  difficultyPreference: 'adaptive' | 'easy' | 'medium' | 'hard'
}

export interface UserStats {
  gamesPlayed: number
  winRate: number
  averageGuesses: number
  hintsUsedDistribution: Record<HintLevel, number>
  difficultyStats: Record<string, {
    played: number
    won: number
    averageGuesses: number
  }>
  streakHistory: Array<{
    date: string
    streak: number
  }>
}
EOF

# lib/types/api.ts
cat > lib/types/api.ts << 'EOF'
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
}
EOF

# lib/types/index.ts
cat > lib/types/index.ts << 'EOF'
export * from './wordle'
export * from './hint'
export * from './user'
export * from './api'
EOF

# ============================================================================
# 6. 创建工具函数
# ============================================================================
echo "🛠️ 创建工具函数..."

# lib/utils/date.ts
cat > lib/utils/date.ts << 'EOF'
export const WORDLE_EPOCH = new Date('2021-06-19') // Wordle开始日期

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function getWordleNumber(date: string | Date): number {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffTime = targetDate.getTime() - WORDLE_EPOCH.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

export function getWordleDate(wordleNumber: number): string {
  const date = new Date(WORDLE_EPOCH)
  date.setDate(date.getDate() + wordleNumber - 1)
  return date.toISOString().split('T')[0]
}

export function isValidWordleDate(date: string): boolean {
  try {
    const targetDate = new Date(date)
    const today = new Date()
    return targetDate >= WORDLE_EPOCH && targetDate <= today
  } catch {
    return false
  }
}

export function formatDateForDisplay(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}
EOF

# lib/utils/wordle.ts
cat > lib/utils/wordle.ts << 'EOF'
import { LetterStatus } from '@/lib/types/wordle'

export function analyzeGuess(guess: string, answer: string): LetterStatus[] {
  const result: LetterStatus[] = new Array(5).fill('absent')
  const answerChars = answer.split('')
  const guessChars = guess.split('')
  
  // 第一遍：标记正确位置
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'correct'
      answerChars[i] = '*' // 标记为已使用
    }
  }
  
  // 第二遍：标记存在但位置错误
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'absent') {
      const foundIndex = answerChars.indexOf(guessChars[i])
      if (foundIndex !== -1) {
        result[i] = 'present'
        answerChars[foundIndex] = '*' // 标记为已使用
      }
    }
  }
  
  return result
}

export function getLetterFrequency(words: string[]): Record<string, number> {
  const frequency: Record<string, number> = {}
  
  words.forEach(word => {
    word.split('').forEach(letter => {
      frequency[letter] = (frequency[letter] || 0) + 1
    })
  })
  
  return frequency
}
EOF

# lib/utils/validation.ts
cat > lib/utils/validation.ts << 'EOF'
export function isValidWord(word: string): boolean {
  return /^[A-Za-z]{5}$/.test(word)
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

export function validateHintLevel(level: any): level is 1 | 2 | 3 | 4 | 5 {
  return Number.isInteger(level) && level >= 1 && level <= 5
}

export function sanitizeInput(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z]/g, '')
}
EOF

# ============================================================================
# 7. 创建核心引擎
# ============================================================================
echo "🧠 创建核心引擎..."

# lib/engines/hintEngine.ts
cat > lib/engines/hintEngine.ts << 'EOF'
import { HintData, HintLevel, HintRequest, HintType } from '@/lib/types/hint'
import { analyzeGuess } from '@/lib/utils/wordle'

export class HintEngine {
  private static instance: HintEngine
  
  static getInstance(): HintEngine {
    if (!HintEngine.instance) {
      HintEngine.instance = new HintEngine()
    }
    return HintEngine.instance
  }
  
  async generateHint(request: HintRequest, answer: string): Promise<HintData> {
    const { level, userGuesses } = request
    
    // 分析用户已有信息
    const knownInfo = this.analyzeUserKnowledge(userGuesses, answer)
    
    // 根据level生成对应提示
    switch (level) {
      case 1:
        return this.generateBasicHint(answer, knownInfo)
      case 2:
        return this.generateStrategicHint(answer, knownInfo, userGuesses)
      case 3:
        return this.generateContextualHint(answer, knownInfo)
      case 4:
        return this.generateStructuralHint(answer, knownInfo)
      case 5:
        return this.generateEmergencyHint(answer, knownInfo)
      default:
        throw new Error(`Invalid hint level: ${level}`)
    }
  }
  
  private analyzeUserKnowledge(guesses: string[], answer: string) {
    const knownCorrect: Record<number, string> = {}
    const knownPresent: string[] = []
    const knownAbsent: string[] = []
    
    guesses.forEach(guess => {
      const result = analyzeGuess(guess, answer)
      guess.split('').forEach((letter, index) => {
        switch (result[index]) {
          case 'correct':
            knownCorrect[index] = letter
            break
          case 'present':
            if (!knownPresent.includes(letter)) {
              knownPresent.push(letter)
            }
            break
          case 'absent':
            if (!knownAbsent.includes(letter)) {
              knownAbsent.push(letter)
            }
            break
        }
      })
    })
    
    return { knownCorrect, knownPresent, knownAbsent }
  }
  
  private generateBasicHint(answer: string, knownInfo: any): HintData {
    const vowels = answer.split('').filter(c => 'AEIOU'.includes(c))
    const hasRepeatedLetters = new Set(answer).size < answer.length
    
    const hints = [
      `这个单词包含 ${vowels.length} 个元音字母`,
      hasRepeatedLetters ? '包含重复字母' : '不包含重复字母',
      `以${/[AEIOU]/.test(answer[0]) ? '元音' : '辅音'}字母开头`,
    ]
    
    return {
      level: 1,
      type: 'basic',
      title: '基础信息',
      content: hints[Math.floor(Math.random() * hints.length)],
      confidence: 0.9,
      revealed: false
    }
  }
  
  private generateStrategicHint(answer: string, knownInfo: any, guesses: string[]): HintData {
    const strategicHints = [
      '尝试包含字母 T, A, E, I',
      '考虑常见的字母组合 TH、CH、ST、ER',
      '关注单词的开头和结尾部分',
    ]
    
    return {
      level: 2,
      type: 'strategic',
      title: '策略建议',
      content: strategicHints[Math.floor(Math.random() * strategicHints.length)],
      confidence: 0.8,
      revealed: false
    }
  }
  
  private generateContextualHint(answer: string, knownInfo: any): HintData {
    const contextualHints = [
      '这是一个日常生活中常见的词',
      '这个词与某个主题相关',
      '这个词在英语中使用频率较高',
    ]
    
    return {
      level: 3,
      type: 'contextual',
      title: '语境提示',
      content: contextualHints[Math.floor(Math.random() * contextualHints.length)],
      confidence: 0.7,
      revealed: false
    }
  }
  
  private generateStructuralHint(answer: string, knownInfo: any): HintData {
    const unknownPositions = [0, 1, 2, 3, 4].filter(pos => 
      !knownInfo.knownCorrect.hasOwnProperty(pos)
    )
    
    if (unknownPositions.length === 0) {
      return this.generateEmergencyHint(answer, knownInfo)
    }
    
    const randomPos = unknownPositions[Math.floor(Math.random() * unknownPositions.length)]
    const letter = answer[randomPos]
    
    return {
      level: 4,
      type: 'structural',
      title: '结构提示',
      content: `第${randomPos + 1}个字母是 ${letter}`,
      confidence: 0.95,
      revealed: false
    }
  }
  
  private generateEmergencyHint(answer: string, knownInfo: any): HintData {
    return {
      level: 5,
      type: 'emergency',
      title: '紧急救援',
      content: `答案的前两个字母是：${answer.slice(0, 2)}`,
      confidence: 0.99,
      revealed: false
    }
  }
}

export const hintEngine = HintEngine.getInstance()
EOF

# ============================================================================
# 8. 创建 API 路由
# ============================================================================
echo "🌐 创建 API 路由..."

# app/api/wordle/route.ts
cat > app/api/wordle/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { getTodayDate, getWordleNumber } from '@/lib/utils/date'
import { ApiResponse, WordleData } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || getTodayDate()
    
    const wordleNumber = getWordleNumber(date)
    
    const wordleData: WordleData = {
      wordleNumber,
      date,
      difficulty: 'medium',
      averageGuesses: 4.2
    }
    
    const response: ApiResponse<WordleData> = {
      success: true,
      data: wordleData,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Wordle data',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
EOF

# app/api/hints/route.ts
cat > app/api/hints/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { hintEngine } from '@/lib/engines/hintEngine'
import { validateHintLevel } from '@/lib/utils/validation'
import { HintRequest } from '@/lib/types/hint'

export async function POST(request: NextRequest) {
  try {
    const body: HintRequest = await request.json()
    const { level } = body
    
    if (!validateHintLevel(level)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid hint level. Must be between 1 and 5.',
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }
    
    // 模拟答案（实际应该从数据库获取）
    const answer = 'CRANE'
    
    const hint = await hintEngine.generateHint(body, answer)
    
    return NextResponse.json({
      success: true,
      data: hint,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to generate hint',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
EOF

# ============================================================================
# 9. 创建 UI 组件
# ============================================================================
echo "🎨 创建 UI 组件..."

# components/ui/Button.tsx
cat > components/ui/Button.tsx << 'EOF'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'success'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'default', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
EOF

# components/ui/Card.tsx
cat > components/ui/Card.tsx << 'EOF'
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  )
}
EOF

# components/ui/Badge.tsx
cat > components/ui/Badge.tsx << 'EOF'
import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-gray-200 text-gray-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
EOF

# ============================================================================
# 10. 创建主要页面
# ============================================================================
echo "📱 创建主要页面..."

# app/layout.tsx
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wordle Hint Pro - 智能Wordle提示系统',
  description: '不剧透的渐进式Wordle提示系统，让每一次猜测都更聪明',
  keywords: ['Wordle', 'hint', '提示', 'puzzle', 'word game'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Wordle Hint Pro
              </h1>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-gray-600">
              <p>&copy; 2025 Wordle Hint Pro. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
EOF

# app/globals.css
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }
  
  body {
    @apply text-gray-900 bg-gray-50;
  }
}

@layer components {
  .container {
    @apply max-w-6xl mx-auto px-4;
  }
}
EOF

# app/page.tsx
cat > app/page.tsx << 'EOF'
import { redirect } from 'next/navigation'
import { getTodayDate } from '@/lib/utils/date'

export default function HomePage() {
  const today = getTodayDate()
  redirect(`/hint/${today}`)
}
EOF

# app/hint/page.tsx
cat > app/hint/page.tsx << 'EOF'
import Link from 'next/link'
import { getTodayDate, getWordleNumber } from '@/lib/utils/date'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function HintHomePage() {
  const today = getTodayDate()
  const todayWordleNumber = getWordleNumber(today)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Wordle Hint Pro
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          智能渐进式提示系统，让每一次猜测都更聪明
        </p>
        
        <Link href={`/hint/${today}`}>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            开始今日Wordle #{todayWordleNumber}
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">渐进式提示</h3>
          <p className="text-gray-600">
            从基础信息到具体提示，5个层级的智能提示系统
          </p>
        </Card>

        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">个性化分析</h3>
          <p className="text-gray-600">
            基于你的猜测历史，提供个性化的策略建议
          </p>
        </Card>

        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">历史追踪</h3>
          <p className="text-gray-600">
            记录你的游戏历史和进步轨迹
          </p>
        </Card>
      </div>
    </div>
  )
}
EOF

# app/hint/[date]/page.tsx
cat > app/hint/[date]/page.tsx << 'EOF'
import { notFound } from 'next/navigation'
import { isValidWordleDate, getWordleNumber, formatDateForDisplay } from '@/lib/utils/date'
import { Card } from '@/components/ui/Card'

interface Props {
  params: { date: string }
}

export default function DailyHintPage({ params }: Props) {
  const { date } = params
  
  if (!isValidWordleDate(date)) {
    notFound()
  }
  
  const wordleNumber = getWordleNumber(date)
  const formattedDate = formatDateForDisplay(date)
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Wordle #{wordleNumber}
        </h1>
        <p className="text-lg text-gray-600">{formattedDate}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">智能提示系统</h2>
          <p className="text-gray-600 mb-4">
            输入你已经尝试的猜测，获得渐进式的智能提示
          </p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Level 1 - 基础信息</h3>
              <p className="text-sm text-gray-600">获取单词的基本特征</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Level 2 - 策略建议</h3>
              <p className="text-sm text-gray-600">智能解题策略指导</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Level 3 - 语境提示</h3>
              <p className="text-sm text-gray-600">单词的主题和使用场景</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Wordle模拟器</h2>
          <p className="text-gray-600 mb-4">
            在这里练习你的猜测
          </p>
          
          <div className="grid gap-1 mb-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex gap-1">
                {Array.from({ length: 5 }, (_, j) => (
                  <div
                    key={j}
                    className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center font-bold text-lg"
                  >
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
EOF

# ============================================================================
# 11. 创建数据文件
# ============================================================================
echo "📊 创建数据文件..."

# data/wordlists/answers.json
cat > data/wordlists/answers.json << 'EOF'
{
  "answers": [
    "CRANE", "SLATE", "ADIEU", "AUDIO", "OUIJA",
    "RAISE", "AROSE", "ARISE", "HOUSE", "MOUSE"
  ]
}
EOF

# data/wordlists/allowed.json
cat > data/wordlists/allowed.json << 'EOF'
{
  "allowed": [
    "AAHED", "AALII", "AARGH", "ABACA", "ABACI",
    "ABACK", "ABAFT", "ABAKA", "ABAMP", "ABAND"
  ]
}
EOF

# ============================================================================
# 12. 创建文档
# ============================================================================
echo "📚 创建文档..."

# README.md
cat > README.md << 'EOF'
# 🎯 Wordle Hint Pro

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)

> 🧠 **不剧透的智能Wordle提示系统** - 帮助玩家提升解题能力，而不是直接给答案

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

访问 `http://localhost:3000` 查看项目

## ✨ 特色功能

- 🎯 **5级渐进式提示系统** - 从基础信息到紧急救援
- 📊 **智能分析引擎** - 基于用户猜测动态调整
- 📱 **完美移动端适配** - 响应式设计
- 🎨 **现代化UI** - 基于Tailwind CSS
- ⚡ **高性能** - Next.js 14 + TypeScript

## 📋 项目结构

```
wordle-hint-pro/
├── app/                    # Next.js 14 App Router
├── components/             # React组件
├── lib/                    # 工具函数和类型
├── data/                   # 数据文件
└── docs/                   # 文档
```

## 🛠️ 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **图表**: Recharts

## 📈 核心功能

### 智能提示系统
- Level 1: 基础信息
- Level 2: 策略建议  
- Level 3: 语境提示
- Level 4: 结构提示
- Level 5: 紧急救援

### API接口
- `GET /api/wordle` - 获取Wordle数据
- `POST /api/hints` - 生成智能提示

## 🚀 部署

推荐使用 [Vercel](https://vercel.com) 部署：

```bash
npm i -g vercel
vercel --prod
```

## 📄 许可证

MIT License
EOF

# package.json scripts 更新
echo "📝 更新 package.json 脚本..."

# 创建开发脚本
cat > scripts/dev.sh << 'EOF'
#!/bin/bash
echo "🚀 启动开发服务器..."
npm run dev
EOF
chmod +x scripts/dev.sh

# 创建构建脚本  
cat > scripts/build.sh << 'EOF'
#!/bin/bash
echo "🔨 构建生产版本..."
npm run build
EOF
chmod +x scripts/build.sh

echo ""
echo "🎉 项目创建完成！"
echo ""
echo "📋 接下来的步骤："
echo "1. cd $PROJECT_NAME"
echo "2. npm install"
echo "3. npm run dev"
echo ""
echo "🌐 开发服务器地址: http://localhost:3000"
echo "📚 查看 README.md 了解更多信息"
echo ""
echo "✨ 开始你的Wordle Hint Pro开发之旅吧！"

# 返回上级目录
cd ..

echo ""
echo "📦 项目已打包到: $PROJECT_NAME/"
echo "💡 使用以下命令开始："
echo "   cd $PROJECT_NAME"
echo "   npm install"
echo "   npm run dev"
