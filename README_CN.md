# GRA.FUN - Monad Meme 代币启动平台

**[English](README.md) \| 中文**

一个使用 React、Vite、TypeScript 和 Tailwind CSS 构建的 Meme
代币发行平台。

## 项目结构

这是一个由 Vite 驱动的 React 应用程序：

    Gnad.fun-Webapp/
    ├── .github/                # GitHub 工作流、Issue 模板等
    ├── public/                 # 静态资源（图片、favicon 等）
    │   └── imgs/
    ├── src/                    # 源代码
    │   ├── assets/             # 静态/共享资源（图片、图标、字体）
    │   ├── components/         # 可复用 UI 组件
    │   ├── features/           # 基于 feature 的模块（领域逻辑）
    │   │   ├── token-launch/     # 代币创建向导
    │   │   │   ├── components/   # 向导 UI 部分
    │   │   │   ├── services/     # 功能逻辑（如 API 调用）
    │   │   │   ├── types/        # 功能相关的 TypeScript 类型
    │   │   │   └── index.ts      # 功能入口
    │   │   └── trending/         # 热门代币列表展示
    │   │       ├── components/
    │   │       ├── services/
    │   │       ├── types/
    │   │       └── index.ts
    │   ├── layouts/             # 布局组件（主布局、仪表盘布局等）
    │   ├── services/            # 共享服务（API 客户端、授权等）
    │   ├── styles/              # 全局样式（Tailwind 配置与 CSS）
    │   ├── types/               # 全局共享 TS 类型
    │   ├── utils/               # 工具函数
    │   ├── charts/              # 图表组件（Recharts）
    │   ├── icons/               # 图标组件（Lucide）
    │   └── main.tsx             # 应用入口
    ├── tests/                   # 自动化测试（单元/集成）
    ├── vite.config.ts           # Vite 配置
    ├── tsconfig.json            # TypeScript 配置
    ├── package.json             # 依赖与脚本
    └── README.md                # 文档

## 功能特性

-   🚀 **代币发行**：几秒钟创建你的 Meme 代币\
-   📊 **实时图表**：基于 Recharts 展示价格趋势\
-   🔥 **热门列表**：查看 24 小时涨幅前排代币\
-   ⏰ **最新代币**：浏览刚刚创建的代币\
-   💼 **钱包集成**：模拟钱包连接用于创建代币\
-   🎨 **精美界面**：渐变背景 + 玻璃拟态风格\
-   ⚡ **极速开发体验**：基于 Vite 的瞬时热更新

## 技术栈

-   **框架**：React 18 + TypeScript\
-   **构建工具**：Vite 5\
-   **样式**：Tailwind CSS v4\
-   **UI 组件**：Shadcn/ui\
-   **图表**：Recharts\
-   **图标**：Lucide React

## 快速开始

### 安装依赖

``` bash
npm install
```

### 启动开发环境

``` bash
npm run dev
```

访问：`http://localhost:5173`

### 构建生产环境

``` bash
npm run build
npm run preview
```

## 开发特性

-   **HMR 热更新**：无需刷新页面\
-   **Fast Refresh**：组件状态不丢失\
-   **TypeScript 全类型支持**\
-   **路径别名**：通过 `@/` 快速导入\
-   **ESLint**：保持代码风格一致

## 项目亮点

-   **响应式设计**：移动端优先\
-   **交互图表**：可视化价格变化\
-   **模拟钱包**：展示功能流程\
-   **代币管理**：创建+浏览完整流程\
-   **玻璃拟态风格**：现代化 UI 效果
