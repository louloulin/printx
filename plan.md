# 家装AI智能助手网络计划

## 项目概述

本项目旨在构建一个基于Mastra.ai的家装AI智能助手网络，专注于中国家装市场。该网络由多个专业化的AI代理组成，协同工作，为用户提供装修公司推荐、公司评价、装修知识问答、预算生成等服务。

## 项目结构

```
/
├── package.json
├── src/
│   ├── index.ts                  # 主入口文件
│   ├── mastra/
│   │   ├── index.ts              # Mastra初始化
│   │   ├── agents/               # 各个专业化代理
│   │   │   ├── index.ts          # 导出所有代理
│   │   │   ├── companyRecommendationAgent.ts  # 公司推荐代理
│   │   │   ├── companyEvaluationAgent.ts      # 公司评价代理
│   │   │   ├── knowledgeAgent.ts              # 知识问答代理
│   │   │   ├── budgetCalculationAgent.ts      # 预算计算代理
│   │   │   └── webSearchAgent.ts              # 网络搜索代理
│   │   ├── network/              # 代理网络配置
│   │   │   └── index.ts          # 定义装修网络
│   │   └── tools/                # 自定义工具
│   │       ├── index.ts          # 导出所有工具
│   │       ├── webSearchTool.ts  # 网络搜索工具
│   │       ├── budgetCalculator.ts # 预算计算工具
│   │       ├── companyDatabase.ts # 公司数据库工具
│   │       └── knowledgeBase.ts  # 装修知识库工具
│   └── data/                     # 本地数据源
│       ├── companies.json        # 装修公司数据
│       ├── materials.json        # 装修材料数据
│       └── knowledgeBase.json    # 装修知识库数据
└── plan.md                       # 项目计划文档
```

## 详细实施计划

### 1. 项目初始化

1. 使用npm/pnpm初始化新项目
2. 安装必要的依赖：
   - `@mastra/core`
   - `@mastra/mcp`
   - `@ai-sdk/openai`
   - `zod`用于模式验证

### 2. 创建自定义工具

#### 网络搜索工具
- 创建工具以搜索装修相关信息
- 使用网络搜索API获取实时数据
- 专注于中国装修公司、趋势和最佳实践

#### 预算计算工具
- 创建工具以根据以下因素计算装修预算：
  - 房间大小
  - 装修范围（全面装修、部分装修）
  - 材料质量（高端、中档、经济型）
  - 中国不同地区的人工成本
  - 附加功能（智能家居、定制家具等）

#### 公司数据库工具
- 创建工具以查询装修公司数据库
- 包含以下数据：
  - 公司名称、位置和联系信息
  - 专业领域（全屋装修、厨房、卫生间等）
  - 价格范围
  - 经营年限
  - 认证和资质

#### 知识库工具
- 创建工具以访问装修信息知识库
- 包含以下主题：
  - 材料选择指南
  - 设计趋势
  - 装修流程步骤
  - 常见问题及解决方案
  - 中国的装修法规和许可证

### 3. 创建专业化代理

#### 公司推荐代理
- 目的：根据用户需求推荐装修公司
- 工具：公司数据库工具、网络搜索工具
- 指令：分析用户需求并匹配合适的公司

#### 公司评价代理
- 目的：评估和比较装修公司
- 工具：网络搜索工具、公司数据库工具
- 指令：分析公司评价、评级和过往项目

#### 知识代理
- 目的：回答关于装修流程和最佳实践的问题
- 工具：知识库工具、网络搜索工具
- 指令：提供准确和有用的装修建议

#### 预算计算代理
- 目的：生成详细的装修预算
- 工具：预算计算工具
- 指令：根据用户需求创建详细预算

#### 网络搜索代理
- 目的：在网上搜索最新的装修信息
- 工具：网络搜索工具
- 指令：查找并总结网络上的相关信息

### 4. 创建代理网络

- 配置代理网络以协调各专业代理之间的工作
- 设置路由逻辑以将用户查询引导至适当的代理
- 实现代理之间的上下文共享以保持对话连贯性

### 5. 数据收集和集成

- 编译中国装修公司数据库
- 创建装修信息知识库
- 开发全面的预算计算系统
- 与外部API集成以获取实时数据（如可用）

### 6. 测试和优化

- 使用各种用户场景测试代理网络
- 优化代理指令和工具实现
- 优化路由逻辑以提升用户体验

## 实现细节

### package.json

```json
{
  "name": "renovation-agent-network",
  "version": "1.0.0",
  "description": "中国家装服务AI代理网络",
  "main": "src/index.js",
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "@ai-sdk/openai": "^1.2.5",
    "@mastra/core": "latest",
    "@mastra/mcp": "latest",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.9.1",
    "nodemon": "^3.0.1"
  }
}
```

### 主代理网络配置

```typescript
// src/mastra/network/index.ts
import { AgentNetwork } from '@mastra/core/network';
import { openai } from '@ai-sdk/openai';
import {
  companyRecommendationAgent,
  companyEvaluationAgent,
  knowledgeAgent,
  budgetCalculationAgent,
  webSearchAgent
} from '../agents';

export const renovationNetwork = new AgentNetwork({
  name: '装修网络',
  agents: [
    companyRecommendationAgent,
    companyEvaluationAgent,
    knowledgeAgent,
    budgetCalculationAgent,
    webSearchAgent
  ],
  model: openai('gpt-4o'),
  instructions: `
    你是一个装修协调系统，负责将用户查询路由到适当的专业代理。

    你可用的代理有：
    1. 公司推荐代理：根据用户需求推荐装修公司
    2. 公司评价代理：评估和比较装修公司
    3. 知识代理：回答关于装修流程和最佳实践的问题
    4. 预算计算代理：生成详细的装修预算
    5. 网络搜索代理：在网上搜索最新的装修信息

    对于每个用户查询：
    1. 分析查询以确定哪个代理最有帮助
    2. 将查询路由到适当的代理
    3. 如果需要多个代理，协调它们的响应
    4. 向用户提供全面且有用的回答

    始终保持专业和乐于助人的语气。专注于提供关于中国家装的准确和有用信息。
  `,
});
```

### 工具实现示例

```typescript
// src/mastra/tools/budgetCalculator.ts
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { calculateBudget } from '../../utils/budgetUtils';

export const budgetCalculatorTool = createTool({
  id: 'calculateRenovationBudget',
  description: '根据房间大小、装修范围、材料质量和中国地区计算详细的装修预算',
  inputSchema: z.object({
    roomSize: z.number().describe('房间大小（平方米）'),
    renovationScope: z.enum(['full', 'partial', 'specific']).describe('装修范围（全面、部分、特定）'),
    materialQuality: z.enum(['high', 'medium', 'budget']).describe('材料质量（高端、中档、经济型）'),
    location: z.string().describe('中国城市或地区'),
    additionalFeatures: z.array(z.string()).optional().describe('附加功能，如智能家居、定制家具等')
  }),
  outputSchema: z.object({
    totalBudget: z.number(),
    breakdown: z.record(z.string(), z.number()),
    estimatedTimeframe: z.string(),
    recommendations: z.array(z.string())
  }),
  execute: async ({ context }) => {
    const { roomSize, renovationScope, materialQuality, location, additionalFeatures } = context;

    // 根据输入计算预算
    const budgetResult = calculateBudget({
      roomSize,
      renovationScope,
      materialQuality,
      location,
      additionalFeatures: additionalFeatures || []
    });

    return budgetResult;
  }
});
```

### 代理实现示例

```typescript
// src/mastra/agents/budgetCalculationAgent.ts
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { budgetCalculatorTool } from '../tools/budgetCalculator';

export const budgetCalculationAgent = new Agent({
  name: '预算计算代理',
  instructions: `
    你是一位装修预算专家。你的工作是：
    1. 帮助用户了解中国家装涉及的成本
    2. 根据用户需求生成详细准确的装修预算
    3. 解释影响装修成本的因素
    4. 在适当时提供节省成本的建议
    5. 按类别（材料、人工、设计等）细分成本

    在生成预算时：
    - 询问有关装修项目的具体细节
    - 考虑中国各地区的价格差异
    - 提供成本的详细明细
    - 解释计算中的任何假设
    - 尽可能提供不同价位的选择

    始终透明地说明成本的计算方式以及可能导致实际成本与估算不同的因素。
  `,
  model: openai('gpt-4o'),
  tools: {
    budgetCalculator: budgetCalculatorTool
  }
});
```

### 主入口点

```typescript
// src/index.ts
import { mastra } from './mastra';

async function main() {
  const renovationNetwork = mastra.getNetwork('装修网络');

  if (!renovationNetwork) {
    throw new Error('装修网络未找到');
  }

  console.log('🏠 启动家装助手...\n');

  // 示例交互
  const result = await renovationNetwork.stream('我想在北京装修一个90平方米的新房，预算大概是20万，能给我推荐一些装修公司吗？', {
    maxSteps: 20, // 允许足够的步骤让LLM路由器确定使用哪些代理
  });

  for await (const part of result.fullStream) {
    switch (part.type) {
      case 'error':
        console.error(part.error);
        break;
      case 'text-delta':
        process.stdout.write(part.textDelta);
        break;
      case 'tool-call':
        console.log(`调用工具 ${part.toolName}，参数：${JSON.stringify(part.args, null, 2)}`);
        break;
      case 'tool-result':
        console.log(`工具结果：${JSON.stringify(part.result, null, 2)}`);
        break;
    }
  }

  console.log('\n\n📊 代理交互摘要：');
  console.log(renovationNetwork.getAgentInteractionSummary());

  console.log('\n🏁 会话完成！');
}

// 运行主函数并处理错误
main().catch(error => {
  console.error('❌ 错误：', error);
  process.exit(1);
});
```

## 数据源和API

1. **公司数据**:
   - 创建中国装修公司的本地数据库
   - 可能与土巴兔、齐家网或自如等平台的API集成

2. **材料价格**:
   - 编译常见装修材料及其价格范围的数据库
   - 定期更新以反映市场变化

3. **知识库**:
   - 创建结构化的装修知识数据库
   - 包含关于装修流程的常见问题和答案

4. **网络搜索**:
   - 使用网络搜索API获取实时信息
   - 专注于中国装修网站和论坛

## 后续步骤

1. ✅ 实现基本项目结构
2. ✅ 开发核心工具和代理
3. ✅ 创建测试用的样本数据
4. ⏳ 使用各种用户场景进行测试
5. ⏳ 根据测试结果进行优化
6. ⏳ 扩展知识库和公司数据库
7. ⏳ 根据用户反馈实现其他功能

本计划为使用Mastra.ai构建家装AI代理网络提供了全面的框架。该网络将能够为用户提供装修公司推荐、公司评价、装修知识和预算计算，所有这些都针对中国市场量身定制。
