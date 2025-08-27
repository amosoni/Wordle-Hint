# 🚀 Real-Time Wordle Hint System

## 概述

这是一个完全自动化的实时Wordle提示系统，每天凌晨12点自动更新当天的Wordle单词、提示和相关文章，无需人工干预。

## ✨ 核心功能

### 🌅 每日自动更新
- **时间**: 每天凌晨00:00 (午夜12点)
- **内容**: 
  - 新的Wordle单词
  - 6个级别的动态提示
  - 5篇高质量教育文章
  - 实时缓存清理

### 🔄 实时数据同步
- **Wordle缓存刷新**: 每2小时自动刷新
- **缓存清理**: 每6小时自动清理过期数据
- **健康监控**: 每30分钟系统健康检查
- **状态监控**: 实时系统状态显示

### 🎯 智能备用系统
- **外部API**: 优先使用实时Wordle API
- **本地备用**: 当外部API不可用时，使用智能日期算法
- **每日轮换**: 确保每天返回不同的单词
- **无缝切换**: 用户无感知的备用机制

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   Local         │    │   Article       │
│   Wordle API    │◄──►│   Fallback      │◄──►│   Generator     │
└─────────────────┘    │   System        │    └─────────────────┘
                       └─────────────────┘              │
                                │                       │
                       ┌─────────────────┐              │
                       │   Cache         │              │
                       │   Manager       │              │
                       └─────────────────┘              │
                                │                       │
                       ┌─────────────────┐              │
                       │   Scheduler     │◄─────────────┘
                       │   (Auto-run)    │
                       └─────────────────┘
```

## 📊 调度器配置

| 功能 | 频率 | 时间 | 说明 |
|------|------|------|------|
| 每日文章生成 | 每天 | 00:00 | 生成新单词的所有内容 |
| Wordle缓存刷新 | 每2小时 | 自动 | 保持数据新鲜 |
| 缓存清理 | 每6小时 | 自动 | 清理过期数据 |
| 健康检查 | 每30分钟 | 自动 | 系统状态监控 |

## 🎮 使用方法

### 1. 自动运行 (推荐)
系统启动后自动运行，无需任何操作：
```bash
npm run dev
# 或
npm start
```

### 2. 手动控制
访问管理页面: `/admin`

#### 可用操作:
- **Start Scheduler**: 启动调度器
- **Stop Scheduler**: 停止调度器
- **Generate Articles**: 手动生成文章
- **Refresh Wordle**: 强制刷新Wordle数据
- **Clear Caches**: 清理所有缓存
- **Health Check**: 运行健康检查

### 3. API控制
```bash
# 启动调度器
curl -X POST http://localhost:3000/api/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "start-scheduler"}'

# 强制刷新Wordle数据
curl -X POST http://localhost:3000/api/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "refresh-wordle"}'

# 手动生成文章
curl -X POST http://localhost:3000/api/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "generate-articles"}'
```

## 📈 监控和状态

### 实时状态页面
访问 `/admin` 查看:
- 系统运行状态
- 调度器状态
- 文章数量统计
- 缓存使用情况
- 健康检查结果
- 下次运行时间

### 系统指标
- **Uptime**: 系统运行时间
- **Memory Usage**: 内存使用情况
- **Cache Stats**: 缓存统计
- **Health Status**: 健康状态
- **Last Run Times**: 最后运行时间

## 🔧 配置选项

### 调度器配置
```typescript
const schedulerOptions = {
  enableDailyGeneration: true,        // 启用每日生成
  generationTime: '00:00',            // 生成时间 (HH:MM)
  enableCacheCleanup: true,           // 启用缓存清理
  cacheCleanupInterval: 6,            // 缓存清理间隔 (小时)
  enableWordleCacheRefresh: true,     // 启用Wordle缓存刷新
  wordleCacheRefreshInterval: 2,      // Wordle刷新间隔 (小时)
  enableHealthMonitoring: true,       // 启用健康监控
  healthCheckInterval: 30             // 健康检查间隔 (分钟)
}
```

### 环境变量
```bash
# Wordle API配置
NEXT_PUBLIC_WORDLE_API_URL=https://wordle-api.vercel.app/api
WORDLE_API_KEY=your_api_key_here

# 系统配置
NODE_ENV=production
```

## 🚨 故障排除

### 常见问题

#### 1. 外部API连接失败
**症状**: 日志显示 "ConnectTimeoutError"
**解决方案**: 
- 系统自动切换到本地备用数据
- 检查网络连接
- 验证API密钥

#### 2. 调度器未启动
**症状**: 管理页面显示 "Scheduler: Stopped"
**解决方案**:
```bash
curl -X POST http://localhost:3000/api/admin \
  -d '{"action": "start-scheduler"}'
```

#### 3. 缓存问题
**症状**: 数据不更新或重复
**解决方案**:
```bash
curl -X POST http://localhost:3000/api/admin \
  -d '{"action": "clear-caches"}'
```

### 日志监控
系统提供详细的日志输出:
```
🚀 Starting enhanced article scheduler...
📅 Next daily article generation scheduled for: 2025-08-28 00:00:00
🧹 Cache cleanup scheduled every 6 hours
🔄 Wordle cache refresh scheduled every 2 hours
💓 Health monitoring scheduled every 30 minutes
✅ Enhanced article scheduler started successfully
```

## 📚 技术实现

### 核心组件
- **ArticleScheduler**: 主调度器，管理所有定时任务
- **WordleApiService**: Wordle数据获取和缓存管理
- **ArticleManager**: 文章生成和管理
- **ContentQualityAnalyzer**: 内容质量分析

### 缓存策略
- **多层缓存**: 内存缓存 + 文件系统持久化
- **智能过期**: 基于时间的自动过期机制
- **增量更新**: 只更新变化的数据

### 错误处理
- **优雅降级**: API失败时自动切换到备用数据
- **重试机制**: 自动重试失败的请求
- **健康检查**: 定期检查系统状态

## 🎯 性能优化

### 缓存优化
- 内存缓存减少API调用
- 文件系统持久化防止数据丢失
- 智能过期清理减少内存占用

### 调度优化
- 精确的时间计算
- 避免重复任务
- 资源使用监控

### 并发处理
- 异步任务处理
- 非阻塞操作
- 资源池管理

## 🔮 未来扩展

### 计划功能
- [ ] 多语言支持
- [ ] 用户自定义调度
- [ ] 高级分析报告
- [ ] 移动端应用
- [ ] 社交媒体集成

### 性能提升
- [ ] Redis缓存支持
- [ ] 数据库优化
- [ ] CDN集成
- [ ] 负载均衡

## 📞 支持

### 系统状态
- 实时状态: `/admin`
- API状态: `/api/admin`
- 健康检查: `/api/admin` (POST: health-check)

### 日志位置
- 控制台输出: 开发环境
- 文件日志: 生产环境 (计划中)
- 错误追踪: 控制台 + 管理页面

---

**🎉 恭喜！你的Wordle提示系统现在已经完全自动化，每天都会自动更新，无需任何人工干预！** 