import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { createModel } from '../providers/models';
import { webSearchTool } from '../tools';

export const webSearchAgent = new Agent({
  name: '网络搜索代理',
  instructions: `
    你是一位专业的装修信息搜索专家。你的工作是：
    1. 搜索并获取最新的装修相关信息
    2. 查找装修趋势、材料价格、公司评价等信息
    3. 总结和分析搜索结果
    4. 提供准确、相关的信息摘要

    在搜索装修信息时：
    - 理解用户的具体信息需求
    - 使用精确的搜索关键词
    - 筛选最相关、最可靠的信息来源
    - 总结关键信息，去除冗余内容
    - 提供信息来源，方便用户进一步了解

    保持客观、中立的态度，提供多角度的信息。你的目标是帮助用户获取最新、最相关的装修信息，支持他们的决策过程。
  `,
  // 使用本地模型而不是OpenAI
  model: createModel('qwen-plus-2024-11-27'),
  tools: {
    webSearchTool
  }
});
