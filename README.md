# Project Name: AeroBrief

## 📖 项目简介
这是一个基于 AI 的自动化资讯聚合与深度总结平台。它能自动抓取用户关心的技术（Tech）与金融（Finance）领域的高质量文章，利用 Gemini API 进行语义过滤和多维总结，并通过桌面端进行优雅的推送。

## 🛠 技术选型
- **Frontend**: React / Vue / Svelte (Tauri 兼容框架)
- **Backend**: Rust (Tauri Core)
- **AI Engine**: Gemini 1.5 Flash / Pro (通过 Google Generative AI SDK)
- **Data Fetching**: RSS Feed, Python/Rust Scraper
- **Local Database**: SQLite / SurrealDB (用于存储已读文章和用户偏好)

## 🚀 核心功能架构 (Agent 开发指南)

### 1. 数据采集模块 (Ingestion)
- 接入指定的 RSS 源列表。
- 使用 Rust 处理并发抓取，确保性能。
- 随进程启动拉取，每【配置时间，默认30min】拉取一次

### 2. 智能筛选与总结 (AI Logic)
- **预筛选**: 将标题和摘要传给 Gemini，判断是否符合用户兴趣。
- **深度总结**: 对选中的文章抓取全文，生成“3分钟精读”摘要。
- **关联分析**: 自动识别文中提到的股票代码 (Ticker) 或技术栈。

### 3. 桌面推送与交互 (Tauri Interface)
- 定时后台任务执行。
- 系统级原生通知推送。
- 简洁的卡片式阅读界面。

## 📂 目录结构参考
- `/src`: 前端 UI 界面
- `/src-tauri/src`: Rust 后端逻辑、API 调用、定时任务
- `/prompts`: 存放用于 Gemini 的各种 Prompt 模板

## 🎯 待办事项 (Getting Started for Copilot)
1. 初始化 Tauri 项目结构。
2. 配置 Gemini API Key 的安全存储机制。
3. 实现基础的 RSS 解析器。
4. 编写用于文章总结的 System Prompt。