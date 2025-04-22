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
