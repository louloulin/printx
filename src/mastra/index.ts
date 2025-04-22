import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import {
  weatherAgent,
  companyRecommendationAgent,
  companyEvaluationAgent,
  knowledgeAgent,
  budgetCalculationAgent,
  webSearchAgent,
  mockAgent
} from './agents';
import { renovationNetwork } from './network';

// 创建并导出 Mastra 实例
export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: {
    weatherAgent,
    companyRecommendationAgent,
    companyEvaluationAgent,
    knowledgeAgent,
    budgetCalculationAgent,
    webSearchAgent,
    mockAgent
  },
  networks: {
    renovationNetwork
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

// 打印调试信息
console.log('Mastra 实例初始化完成');
console.log('- 已配置代理数量: 6');
console.log('- 已配置网络数量: 1');
