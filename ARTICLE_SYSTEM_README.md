# Wordle Hint Pro - 真实文章生成系统

## 🎯 系统概述

这是一个完整的Wordle提示文章生成系统，能够：

- **自动获取每日Wordle单词** - 从真实API获取每日单词
- **智能生成教育文章** - 为每个单词生成5种不同类型的文章
- **定时任务管理** - 每天自动生成新文章
- **文章存储管理** - 本地存储和缓存管理
- **完整的API接口** - 提供文章的所有CRUD操作

## 🚀 快速开始

### 1. 环境配置

创建 `.env.local` 文件：

```bash
# Wordle API Configuration
NEXT_PUBLIC_WORDLE_API_URL=https://wordle-api.vercel.app/api
WORDLE_API_KEY=your_api_key_here

# Article Generation Settings
NEXT_PUBLIC_ARTICLE_GENERATION_ENABLED=true
NEXT_PUBLIC_DAILY_GENERATION_TIME=00:01
NEXT_PUBLIC_CACHE_CLEANUP_INTERVAL=6

# Storage Settings
NEXT_PUBLIC_ENABLE_ARTICLE_CACHING=true
NEXT_PUBLIC_ARTICLE_CACHE_EXPIRY_HOURS=24
```

### 2. 启动系统

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 系统会自动初始化并开始生成文章
```

## 📚 文章类型

系统为每个单词生成5种类型的文章：

1. **词汇分析文章** - 深入分析单词结构、发音、用法
2. **策略指导文章** - Wordle游戏策略和技巧
3. **词汇构建文章** - 词汇学习和扩展
4. **高级策略文章** - 高级技巧和模式识别
5. **词源历史文章** - 单词的历史和文化背景

## 🔧 API接口

### 主要端点

#### GET `/api/wordle`
获取今日Wordle单词和提示，包含自动生成的文章

#### GET `/api/articles`
获取文章列表，支持多种查询参数：
- `category` - 按分类筛选
- `tag` - 按标签筛选  
- `search` - 搜索文章
- `type` - 文章类型 (recent, popular)
- `limit` - 返回数量限制

#### POST `/api/articles`
文章生成和管理：
```json
{
  "action": "generate",
  "word": "ABOUT",
  "date": "2024-01-15"
}
```

#### GET `/api/admin`
获取系统状态和统计信息

#### POST `/api/admin`
系统控制操作：
```json
{
  "action": "start_scheduler",
  "schedulerOptions": {
    "generationTime": "00:01",
    "cacheCleanupInterval": 6
  }
}
```

## ⏰ 定时任务

### 自动文章生成
- **时间**: 每天凌晨00:01（可配置）
- **功能**: 自动获取当日Wordle单词并生成文章
- **状态**: 可通过管理API查看和控制

### 缓存清理
- **频率**: 每6小时（可配置）
- **功能**: 清理过期的缓存数据
- **优化**: 保持系统性能

## 🗄️ 存储系统

### 本地存储
- 使用Map数据结构存储文章
- 支持按单词、分类、标签快速检索
- 自动持久化到localStorage

### 缓存管理
- 智能缓存Wordle API响应
- 可配置缓存过期时间
- 自动清理过期缓存

## 📊 系统监控

### 健康检查
```typescript
// 检查系统状态
const status = await articleManager.getStatus()
console.log('System status:', status)

// 检查调度器状态
const schedulerStatus = scheduler.getStatus()
console.log('Scheduler status:', schedulerStatus)
```

### 统计信息
- 总文章数量
- 总单词数量
- 分类统计
- 浏览量统计
- 点赞数统计

## 🛠️ 开发指南

### 添加新的文章类型

1. 在 `ArticleTemplate` 接口中添加新类型
2. 在 `ArticleGenerator` 中实现内容生成函数
3. 更新模板初始化

```typescript
// 在 initializeTemplates 中添加
{
  title: 'New Article Type: "{word}"',
  category: 'New Category',
  difficulty: 'Intermediate',
  readingTime: '4-5 minutes',
  tags: ['new', 'category'],
  contentGenerator: this.generateNewTypeArticle.bind(this)
}
```

### 自定义文章生成逻辑

```typescript
private generateNewTypeArticle(word: string, wordData: WordleDailyData): string {
  // 实现你的文章生成逻辑
  return `
    <article class="new-type-article">
      <h2>New Article for "${word.toUpperCase()}"</h2>
      <!-- 你的HTML内容 -->
    </article>
  `
}
```

## 🔍 故障排除

### 常见问题

1. **文章生成失败**
   - 检查Wordle API连接
   - 查看控制台错误日志
   - 验证环境变量配置

2. **定时任务不工作**
   - 检查调度器状态
   - 验证时间配置
   - 查看系统日志

3. **缓存问题**
   - 手动清理缓存
   - 检查缓存配置
   - 重启系统

### 调试模式

启用调试模式查看详细日志：

```bash
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

## 📈 性能优化

### 缓存策略
- 文章内容本地缓存
- API响应智能缓存
- 自动过期管理

### 存储优化
- 按需加载文章
- 分页查询支持
- 索引优化

## 🔐 安全考虑

- API密钥保护
- 输入验证和清理
- 错误信息脱敏
- 访问控制

## 🚀 部署

### Vercel部署
1. 推送代码到GitHub
2. 连接Vercel项目
3. 配置环境变量
4. 自动部署

### 其他平台
- 支持所有Node.js环境
- 需要配置环境变量
- 确保文件系统权限

## 📞 支持

如有问题或建议，请：
1. 查看控制台日志
2. 检查API响应
3. 验证配置设置
4. 提交Issue或PR

---

**注意**: 这是一个完整的生产就绪系统，包含了错误处理、缓存管理、监控等企业级功能。 