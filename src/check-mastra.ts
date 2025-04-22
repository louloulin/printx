import { mastra } from './mastra';

// 检查mastra对象
console.log('Mastra对象类型:', typeof mastra);
console.log('Mastra属性:', Object.keys(mastra));
console.log('Mastra详细信息:', mastra);

// 检查agents
console.log('\n代理信息:');
try {
  const weatherAgent = mastra.getAgent('weatherAgent');
  const companyRecommendationAgent = mastra.getAgent('companyRecommendationAgent');
  const companyEvaluationAgent = mastra.getAgent('companyEvaluationAgent');
  const knowledgeAgent = mastra.getAgent('knowledgeAgent');
  const budgetCalculationAgent = mastra.getAgent('budgetCalculationAgent');
  const webSearchAgent = mastra.getAgent('webSearchAgent');

  console.log('weatherAgent:', weatherAgent ? '已加载' : '未加载');
  console.log('companyRecommendationAgent:', companyRecommendationAgent ? '已加载' : '未加载');
  console.log('companyEvaluationAgent:', companyEvaluationAgent ? '已加载' : '未加载');
  console.log('knowledgeAgent:', knowledgeAgent ? '已加载' : '未加载');
  console.log('budgetCalculationAgent:', budgetCalculationAgent ? '已加载' : '未加载');
  console.log('webSearchAgent:', webSearchAgent ? '已加载' : '未加载');
} catch (error) {
  console.error('获取代理失败:', error);
}

// 检查networks
console.log('\n网络信息:');
try {
  const renovationNetwork = mastra.getNetwork('renovationNetwork');
  console.log('renovationNetwork:', renovationNetwork ? '已加载' : '未加载');
} catch (error) {
  console.error('获取网络失败:', error);
}

// 检查方法
console.log('\n方法信息:');
console.log('getNetwork方法:', typeof mastra.getNetwork);
console.log('getAgent方法:', typeof mastra.getAgent);
