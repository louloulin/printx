import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
import { createModel } from '../providers/models';

// 导入装修智能体
import { companyRecommendationAgent } from './companyRecommendationAgent';
import { companyEvaluationAgent } from './companyEvaluationAgent';
import { knowledgeAgent } from './knowledgeAgent';
import { budgetCalculationAgent } from './budgetCalculationAgent';
import { webSearchAgent } from './webSearchAgent';


// 导出装修智能体
export {
  companyRecommendationAgent,
  companyEvaluationAgent,
  knowledgeAgent,
  budgetCalculationAgent,
  webSearchAgent
};
