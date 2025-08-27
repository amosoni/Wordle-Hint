# 🌐 Wordle API 集成指南

## 📋 概述

本系统已经实现了完整的Wordle API集成，包括：
- 多个API端点的自动轮询和重试
- 智能的备用数据系统
- 实时连接状态监控
- 自动故障转移

## 🔧 配置说明

### 1. 环境变量配置

在项目根目录创建 `.env.local` 文件：

```bash
# Wordle API 配置
NEXT_PUBLIC_WORDLE_API_URL=https://wordle-api.vercel.app/api
WORDLE_API_KEY=your_api_key_here

# 可选：自定义超时设置
WORDLE_API_TIMEOUT=15000
WORDLE_API_RETRY_ATTEMPTS=3
```

### 2. API端点配置

系统默认配置了以下可靠的Wordle API端点：

```typescript
WORDLE_API_ENDPOINTS: [
  'https://wordle-api.vercel.app/api',
  'https://wordle-api.vercel.app/api/today',
  'https://wordle-api.vercel.app/api/word',
  'https://wordle-api.vercel.app/api/random'
]
```

## 🚀 使用方法

### 1. 启动系统

```bash
npm run dev
```

### 2. 访问管理页面

打开浏览器访问：`http://localhost:3000/admin`

### 3. 测试API连接

在管理页面中，点击 **"🌐 Test API Connection"** 按钮来测试所有API端点的连接状态。

## 📊 监控和诊断

### 1. 实时状态监控

管理页面提供以下实时信息：
- **系统概览**：运行时间、内存使用、版本信息
- **文章状态**：文章数量、今日单词、存储状态
- **调度器状态**：运行状态、下次执行时间
- **Wordle状态**：缓存状态、API状态
- **系统健康**：问题检测和报告

### 2. API连接状态

系统会自动检测并报告：
- ✅ 可用的API端点
- ❌ 失败的API端点
- 🔄 当前使用的端点
- ⏱️ 连接响应时间

## 🔄 故障转移机制

### 1. 自动重试

当API请求失败时，系统会：
1. 自动切换到下一个API端点
2. 等待1秒后重试
3. 最多重试3次
4. 如果所有端点都失败，使用本地备用数据

### 2. 本地备用系统

备用系统特点：
- 每天自动轮换单词
- 基于日期的确定性选择
- 确保每天都有不同的提示
- 提示内容完全准确

### 3. 缓存管理

- 缓存有效期：24小时
- 自动清理过期缓存
- 支持手动强制刷新

## 🛠️ 故障排除

### 1. 常见问题

**问题：所有API端点都连接失败**
- 检查网络连接
- 验证API密钥
- 检查防火墙设置
- 尝试使用VPN

**问题：API响应超时**
- 增加超时时间设置
- 检查网络延迟
- 考虑使用更近的服务器

**问题：缓存不更新**
- 手动清理缓存
- 检查调度器状态
- 验证文件权限

### 2. 调试信息

系统提供详细的调试日志：
```
Attempt 1: Trying API endpoint: https://wordle-api.vercel.app/api/today
✅ Successfully fetched from API endpoint: https://wordle-api.vercel.app/api
❌ API attempt 2 failed: ConnectTimeoutError
❌ All API endpoints failed, falling back to local data
```

### 3. 手动操作

在管理页面可以执行以下操作：
- **启动/停止调度器**
- **生成今日文章**
- **刷新Wordle数据**
- **测试API连接**
- **清理所有缓存**
- **运行健康检查**

## 📈 性能优化

### 1. 缓存策略

- 单词数据缓存：24小时
- 文章内容缓存：6小时
- 健康检查缓存：30分钟

### 2. 并发控制

- 限制同时进行的API请求
- 智能的重试间隔
- 避免API端点过载

### 3. 监控指标

- 响应时间统计
- 成功率监控
- 错误率分析
- 资源使用情况

## 🔐 安全考虑

### 1. API密钥管理

- 不要在代码中硬编码API密钥
- 使用环境变量存储敏感信息
- 定期轮换API密钥

### 2. 请求限制

- 设置合理的超时时间
- 限制重试次数
- 监控异常请求模式

### 3. 数据验证

- 验证API响应格式
- 检查数据完整性
- 防止恶意数据注入

## 📞 技术支持

如果遇到问题：

1. 检查管理页面的系统状态
2. 查看浏览器控制台日志
3. 运行API连接测试
4. 检查网络连接状态
5. 验证配置文件设置

## 🎯 最佳实践

1. **定期监控**：每天检查系统状态
2. **及时更新**：保持API端点和配置最新
3. **备份数据**：定期备份本地备用数据
4. **性能优化**：根据使用情况调整缓存设置
5. **安全维护**：定期更新API密钥和访问权限

---

**注意**：本系统设计为高可用性，即使所有外部API都失败，也能通过本地备用系统提供准确的每日提示。 