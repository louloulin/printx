# 基于Mastra构建装修智能体网络

这个项目展示了如何使用Mastra.ai框架构建一个专注于家装服务的AI智能体网络，包括装修公司推荐、装修公司评价、装修知识问答、预算生成等功能。

## 项目概述

本项目构建了一个由多个专业化AI代理组成的网络，每个代理负责特定的家装相关任务。这些代理协同工作，为用户提供全面的家装服务支持。

### 主要功能

- **装修公司推荐**：根据用户需求和偏好推荐合适的装修公司
- **装修公司评价**：提供客观、公正的公司评价和比较
- **装修知识问答**：回答用户关于装修流程、材料选择等问题
- **装修预算生成**：根据用户需求生成详细的装修预算
- **装修信息搜索**：搜索最新的装修趋势和信息

## 技术架构

项目基于Mastra.ai框架构建，主要组件包括：

- **专业化代理**：每个代理专注于特定任务
- **自定义工具**：为代理提供数据访问和处理能力
- **代理网络**：协调多个代理的协作
- **本地数据源**：提供装修公司、材料和知识库数据

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
├── plan.md                       # 项目计划文档
└── README.md                     # 项目说明文档
```

## 如何构建装修智能体

### 1. 环境准备

首先，确保您已安装Node.js和npm/pnpm。然后初始化项目并安装必要的依赖：

```bash
# 创建项目目录
mkdir renovation-agent-network
cd renovation-agent-network

# 初始化项目
npm init -y

# 安装依赖
npm install @mastra/core @mastra/mcp @ai-sdk/openai zod
npm install -D typescript ts-node nodemon @types/node
```

### 2. 创建数据源

为了让智能体能够访问装修相关信息，我们需要创建几个基本的数据文件：

#### 装修公司数据 (src/data/companies.json)

创建一个包含装修公司信息的JSON文件，包括公司名称、位置、专业领域、价格范围等信息。

```json
{
  "companies": [
    {
      "id": "1",
      "name": "北京家装一号",
      "location": "北京",
      "specializations": ["全屋装修", "厨房", "卫生间"],
      "priceRange": "中高端",
      "yearsInBusiness": 15,
      "certifications": ["ISO9001", "中国室内装饰协会认证"],
      "contactInfo": {
        "phone": "010-12345678",
        "email": "contact@jiazhuang1.com",
        "website": "https://www.jiazhuang1.com"
      },
      "rating": 4.7,
      "reviewCount": 1250
    },
    // 更多公司...
  ]
}
```

#### 装修材料数据 (src/data/materials.json)

创建一个包含装修材料信息的JSON文件，包括材料类别、名称、描述、价格范围等信息。

#### 装修知识库 (src/data/knowledgeBase.json)

创建一个包含装修知识的JSON文件，按类别组织装修相关的文章和信息。

### 3. 创建自定义工具

工具是代理与外部数据和服务交互的方式。我们需要创建几个核心工具：

#### 公司数据库工具 (src/mastra/tools/companyDatabase.ts)

```typescript
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// 读取公司数据
const readCompaniesData = () => {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/companies.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading companies data:', error);
    return { companies: [] };
  }
};

// 公司查询工具
export const companyDatabaseTool = createTool({
  id: 'queryCompanyDatabase',
  description: '查询装修公司数据库，根据位置、专业领域、价格范围等条件筛选装修公司',
  inputSchema: z.object({
    location: z.string().optional().describe('城市名称，如"北京"、"上海"等'),
    specialization: z.string().optional().describe('专业领域，如"全屋装修"、"厨房"等'),
    priceRange: z.string().optional().describe('价格范围，如"高端"、"中高端"、"中端"等'),
    minRating: z.number().optional().describe('最低评分，1-5之间的数字'),
    limit: z.number().optional().default(5).describe('返回结果数量限制')
  }),
  outputSchema: z.object({
    companies: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        location: z.string(),
        // 其他字段...
      })
    ),
    totalResults: z.number(),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { location, specialization, priceRange, minRating, limit } = context;
    
    // 读取公司数据
    const data = readCompaniesData();
    let companies = data.companies || [];
    
    // 应用筛选条件
    if (location) {
      companies = companies.filter(company => 
        company.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // 应用其他筛选条件...
    
    // 限制结果数量
    const limitedResults = companies.slice(0, limit || 5);
    
    return {
      companies: limitedResults,
      totalResults: companies.length,
      message: `找到${companies.length}家符合条件的装修公司，显示前${limitedResults.length}家。`
    };
  }
});
```

类似地，创建其他工具：
- 预算计算工具 (budgetCalculator.ts)
- 知识库工具 (knowledgeBase.ts)
- 网络搜索工具 (webSearchTool.ts)

然后在 tools/index.ts 中导出所有工具：

```typescript
import { companyDatabaseTool, companyReviewTool } from './companyDatabase';
import { budgetCalculatorTool, materialPriceTool } from './budgetCalculator';
import { knowledgeBaseTool, renovationQATool } from './knowledgeBase';
import { webSearchTool } from './webSearchTool';

export {
  companyDatabaseTool,
  companyReviewTool,
  budgetCalculatorTool,
  materialPriceTool,
  knowledgeBaseTool,
  renovationQATool,
  webSearchTool
};
```

### 4. 创建专业化代理

每个代理专注于特定任务，使用相关工具来完成任务。

#### 公司推荐代理 (src/mastra/agents/companyRecommendationAgent.ts)

```typescript
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { companyDatabaseTool, companyReviewTool } from '../tools';

export const companyRecommendationAgent = new Agent({
  name: '装修公司推荐代理',
  instructions: `
    你是一位专业的装修公司推荐顾问。你的工作是：
    1. 根据用户的需求和偏好推荐合适的装修公司
    2. 分析装修公司的优势和特点
    3. 提供客观、公正的公司评价和比较
    4. 解释推荐理由，帮助用户做出明智的选择
    
    在推荐装修公司时：
    - 详细了解用户的装修需求、预算、风格偏好和地理位置
    - 考虑公司的专业领域、价格范围、评价和经验
    - 提供多个选择，并说明各自的优缺点
    - 解释为什么这些公司适合用户的特定需求
    - 提供进一步了解这些公司的建议
    
    保持专业、客观的态度，不偏向任何特定公司。你的目标是帮助用户找到最适合其需求的装修公司。
  `,
  model: openai('gpt-4o'),  // 或使用其他支持的模型
  tools: {
    companyDatabaseTool,
    companyReviewTool
  }
});
```

类似地，创建其他代理：
- 公司评价代理 (companyEvaluationAgent.ts)
- 知识代理 (knowledgeAgent.ts)
- 预算计算代理 (budgetCalculationAgent.ts)
- 网络搜索代理 (webSearchAgent.ts)

然后在 agents/index.ts 中导出所有代理：

```typescript
import { companyRecommendationAgent } from './companyRecommendationAgent';
import { companyEvaluationAgent } from './companyEvaluationAgent';
import { knowledgeAgent } from './knowledgeAgent';
import { budgetCalculationAgent } from './budgetCalculationAgent';
import { webSearchAgent } from './webSearchAgent';

export {
  companyRecommendationAgent,
  companyEvaluationAgent,
  knowledgeAgent,
  budgetCalculationAgent,
  webSearchAgent
};
```

### 5. 创建代理网络

代理网络协调多个代理的工作，根据用户查询路由到适当的代理。

#### 装修网络 (src/mastra/network/index.ts)

```typescript
import { openai } from '@ai-sdk/openai';
import { AgentNetwork } from '@mastra/core/network';
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
  model: openai('gpt-4o'),  // 或使用其他支持的模型
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

### 6. 初始化Mastra实例

在 src/mastra/index.ts 中初始化Mastra实例，注册所有代理和网络：

```typescript
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import {
  companyRecommendationAgent,
  companyEvaluationAgent,
  knowledgeAgent,
  budgetCalculationAgent,
  webSearchAgent
} from './agents';
import { renovationNetwork } from './network';

export const mastra = new Mastra({
  agents: {
    companyRecommendationAgent,
    companyEvaluationAgent,
    knowledgeAgent,
    budgetCalculationAgent,
    webSearchAgent
  },
  networks: {
    renovationNetwork
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
```

### 7. 创建测试脚本

创建一个测试脚本来验证装修智能体网络的功能：

```typescript
// src/test-renovation-network.ts
import { mastra } from './mastra';

async function main() {
  try {
    console.log('🏠 启动家装助手...');
    
    // 获取装修网络
    const renovationNetwork = mastra.getNetwork('renovationNetwork');
    
    if (!renovationNetwork) {
      throw new Error('装修网络未找到');
    }
    
    // 示例交互
    const result = await renovationNetwork.stream('我想在北京装修一个90平方米的新房，预算大概是20万，能给我推荐一些装修公司吗？', {
      maxSteps: 20,
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
          console.log(`\n调用工具 ${part.toolName} 参数：${JSON.stringify(part.args, null, 2)}`);
          break;
        case 'tool-result':
          console.log(`\n工具结果：${JSON.stringify(part.result, null, 2)}`);
          break;
      }
    }
    
    console.log('\n\n📊 代理交互摘要：');
    console.log(renovationNetwork.getAgentInteractionSummary());
    
    console.log('\n🏁 会话完成！');
  } catch (error) {
    console.error('❌ 错误：', error);
    throw error;
  }
}

main().catch(error => {
  console.error('❌ 错误：', error);
  process.exit(1);
});
```

### 8. 运行测试

使用以下命令运行测试脚本：

```bash
npx tsx src/test-renovation-network.ts
```

## 扩展和优化

完成基本实现后，可以考虑以下扩展和优化：

1. **扩充数据源**：添加更多装修公司和材料数据
2. **改进工具功能**：增强工具的查询和分析能力
3. **优化代理指令**：根据测试结果调整代理的指令
4. **添加用户界面**：构建Web或移动应用界面
5. **集成外部API**：连接真实的装修公司数据库或价格API
6. **添加多模态功能**：支持图片识别和处理，如识别装修风格

## 注意事项

- 使用OpenAI模型需要设置API密钥，可以通过环境变量`OPENAI_API_KEY`设置
- 本地开发时可以使用`@mastra/local-dev`包进行调试
- 代理网络需要足够的上下文窗口来处理复杂查询，建议使用支持长上下文的模型

## 结论

通过Mastra.ai框架，我们可以构建一个功能强大的装修智能体网络，为用户提供全面的家装服务支持。这个项目展示了如何组织和协调多个专业化代理，以及如何使用自定义工具来增强代理的能力。

随着数据的扩充和代理能力的提升，这个系统可以不断优化，为用户提供更准确、更有用的家装建议。
