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
import { mockAgent } from './mockAgent';

// 创建天气代理
export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: createModel('qwen-plus-2024-11-27'),
  tools: { weatherTool },
});

// 导出装修智能体
export {
  companyRecommendationAgent,
  companyEvaluationAgent,
  knowledgeAgent,
  budgetCalculationAgent,
  webSearchAgent,
  mockAgent
};
