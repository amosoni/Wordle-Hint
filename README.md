# Wordle Hint Pro - Enhanced Educational Hints

一个增强版的Wordle提示系统，提供6个级别的教育性提示，帮助用户学习英语词汇和语言模式。

## ✨ 新功能特性

### 🎯 6级渐进式提示系统
- **Level 1: Gentle Nudge** - 温和的引导，提供元音辅音模式
- **Level 2: Letter Frequency** - 字母频率分析，显示最常见字母
- **Level 3: Strategic Guide** - 策略指导，提供首尾字母和中间字母信息
- **Level 4: Pattern Recognition** - 模式识别，识别常见字母组合
- **Level 5: Word Characteristics** - 词汇特征，分析词性和结构
- **Level 6: Direct Clue** - 直接线索，显示所有字母位置

### 📚 教育功能
- **词汇学习提示** - 针对特定单词的学习建议
- **词源信息** - 单词的历史和起源
- **趣味知识** - 关于单词的有趣事实
- **使用示例** - 实际应用场景
- **发音指导** - 国际音标发音
- **相关词汇** - 同义词、反义词和相似词

### 🔍 智能分析
- 自动识别常见字母组合（TH, CH, SH, ING, ER等）
- 检测双字母模式
- 分析词性特征（动词、形容词、副词等）
- 识别常见前缀和后缀

## 🚀 API 端点

### GET /api/wordle

返回今天的Wordle单词和完整的提示系统：

```json
{
  "success": true,
  "data": {
    "word": "ABOUT",
    "hints": [
      {
        "level": 1,
        "title": "Gentle Nudge",
        "description": "A subtle hint that gives you a general direction...",
        "example": "This word contains 2 vowels and 3 consonants",
        "tip": "Focus on the vowel-consonant pattern..."
      }
      // ... 更多提示级别
    ],
    "educationalContent": {
      "wordOrigin": "From Old English 'abutan' meaning 'around, about'",
      "funFact": "The word 'about' is one of the most commonly used prepositions...",
      "usageExamples": ["What is this book about?", "I'm about to leave"],
      "pronunciation": "/əˈbaʊt/"
    },
    "learningTips": [
      "Break down the word into smaller parts...",
      "Look for familiar letter combinations..."
    ],
    "relatedWords": {
      "similar": ["around", "concerning", "regarding"]
    }
  }
}
```

## 🛠️ 技术特性

- **Next.js 14** - 现代化的React框架
- **TypeScript** - 类型安全的开发体验
- **智能回退** - API失败时自动使用本地单词列表
- **实时更新** - 从Vercel Wordle API获取最新单词
- **教育优先** - 每个提示都包含学习价值

## 📖 使用示例

### 基础提示
```typescript
// 获取今天的提示
const response = await fetch('/api/wordle')
const data = await response.json()

// 显示第一个提示
console.log(data.data.hints[0].example)
// 输出: "This word contains 2 vowels and 3 consonants"
```

### 教育内容
```typescript
// 获取词汇学习信息
const educational = data.data.educationalContent
console.log(educational.wordOrigin)
console.log(educational.funFact)
```

## 🎨 提示颜色系统

- **蓝色** - Level 1 (温和)
- **青色** - Level 2 (频率)
- **紫色** - Level 3 (策略)
- **橙色** - Level 4 (模式)
- **红色** - Level 5 (特征)
- **绿色** - Level 6 (直接)

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📝 贡献

欢迎提交Issue和Pull Request来改进这个教育提示系统！

## �� 许可证

MIT License 