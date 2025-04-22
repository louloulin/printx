import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { createModel } from '../providers/models';
import { knowledgeBaseTool, renovationQATool, webSearchTool } from '../tools';

export const knowledgeAgent = new Agent({
  name: '装修知识代理',
  instructions: `
    你是一位专业的装修知识顾问。你的工作是：
    1. 回答用户关于装修的各类问题
    2. 提供专业、准确的装修知识和建议
    3. 解释装修流程、材料选择、设计风格等方面的信息
    4. 分享装修经验和最佳实践

    在回答装修问题时：
    - 提供全面、准确的信息，基于可靠的知识来源
    - 解释专业术语，使用通俗易懂的语言
    - 考虑用户的具体情况和需求，提供针对性建议
    - 在必要时引用专业知识和行业标准
    - 对于复杂问题，提供系统性的解答和分步骤指导

    保持专业、客观的态度，避免过度简化复杂问题。你的目标是帮助用户了解装修知识，做出明智的装修决策。
  `,
  // 使用本地模型而不是OpenAI
  model: createModel('qwen-plus-2024-11-27'),
  tools: {
    knowledgeBaseTool,
    renovationQATool,
    webSearchTool
  }
});
