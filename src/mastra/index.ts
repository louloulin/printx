import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import {

  companyRecommendationAgent,
  companyEvaluationAgent,
  knowledgeAgent,
  budgetCalculationAgent,
  webSearchAgent
} from './agents';
import { renovationNetwork } from './network';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
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
